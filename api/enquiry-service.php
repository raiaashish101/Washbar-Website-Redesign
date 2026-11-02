<?php
declare(strict_types=1);

final class EnquiryFailure extends RuntimeException
{
    public function __construct(
        public readonly int $httpStatus,
        public readonly string $reason,
        string $message,
        public readonly array $fields = [],
        public readonly ?string $reference = null
    ) {
        parent::__construct($message);
    }
}

function enquiryUnavailable(): EnquiryFailure
{
    return new EnquiryFailure(503, 'unavailable',
        'Online enquiries are unavailable. Please call Wash Bar on 0430 455 920.');
}

// Only the server chooses this path. No request parameter can select a config file.
function enquiryConfig(): array
{
    if (PHP_VERSION_ID < 80200 || !extension_loaded('openssl') || !extension_loaded('json') || !function_exists('fsync') ||
        !in_array('ssl', stream_get_transports(), true)) {
        throw enquiryUnavailable();
    }
    $limit = (int) ini_get('max_execution_time');
    if ($limit > 0 && $limit < 40) {
        throw enquiryUnavailable();
    }
    $path = getenv('WASHBAR_ENQUIRY_CONFIG') ?: '/home1/washbarc/private/washbar-enquiry/config.php';
    $file = realpath($path);
    $root = realpath($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__));
    if (!$file || !$root || !is_readable($file) ||
        str_starts_with($file, $root . DIRECTORY_SEPARATOR) ||
        (fileperms($file) & 0077) !== 0) {
        throw enquiryUnavailable();
    }
    $config = require $file;
    if (!is_array($config) || ($config['enabled'] ?? false) !== true ||
        ($config['smtp_confirmed'] ?? false) !== true) {
        throw enquiryUnavailable();
    }
    foreach (['smtp_host', 'smtp_username', 'smtp_password', 'smtp_encryption', 'hash_secret', 'storage_dir', 'phpmailer_dir'] as $key) {
        if (!is_string($config[$key] ?? null) || $config[$key] === '') {
            throw enquiryUnavailable();
        }
    }
    if ($config['smtp_host'] !== 'mail.wash-bar.com.au' ||
        $config['smtp_username'] !== 'info@wash-bar.com.au' || strlen($config['hash_secret']) < 64 ||
        ($config['smtp_port'] ?? null) !== 465 || $config['smtp_encryption'] !== 'ssl') {
        throw enquiryUnavailable();
    }
    $directory = realpath($config['storage_dir']);
    if (!$directory || !is_dir($directory) || !is_writable($directory) ||
        $directory === $root || str_starts_with($directory, $root . DIRECTORY_SEPARATOR) ||
        (fileperms($directory) & 0077) !== 0) {
        throw enquiryUnavailable();
    }
    if (!is_array($config['allowed_origins'] ?? null) || !$config['allowed_origins']) {
        throw enquiryUnavailable();
    }
    foreach ($config['allowed_origins'] as $origin) {
        if (!is_string($origin)) {
            throw enquiryUnavailable();
        }
        $parts = parse_url($origin);
        if (!$parts || ($parts['scheme'] ?? '') !== 'https' ||
            !isset($parts['host']) ||
            isset($parts['user']) || isset($parts['pass']) || isset($parts['path']) ||
            isset($parts['query']) || isset($parts['fragment'])) {
            throw enquiryUnavailable();
        }
    }
    $library = realpath($config['phpmailer_dir']);
    foreach (['Exception', 'PHPMailer', 'SMTP'] as $class) {
        $source = $library ? realpath($library . '/src/' . $class . '.php') : false;
        if (!$source || !is_readable($source) || str_starts_with($source, $root . DIRECTORY_SEPARATOR)) {
            throw enquiryUnavailable();
        }
        require_once $source;
    }
    if (version_compare(\PHPMailer\PHPMailer\PHPMailer::VERSION, '7.1.1', '<')) {
        throw enquiryUnavailable();
    }
    require_once __DIR__ . '/enquiry-smtp.php';
    $config['storage_dir'] = $directory;
    return $config;
}

final class WashBarEnquiry
{
    public const TYPES = ['General enquiry', 'Commercial laundry', 'Franchise enquiry', 'Community partnership'];
    private Closure $transport;

    public function __construct(private readonly array $config, ?Closure $transport = null)
    {
        $this->transport = $transport ?? fn (array $message): bool => enquirySendSMTP($this->config, $message);
        $this->transaction(static fn (array &$state): null => null);
    }

    public static function validate(array $input): array
    {
        $allowed = ['enquiryType', 'name', 'email', 'phone', 'message', 'website', 'reference'];
        if (array_diff(array_keys($input), $allowed)) {
            throw new EnquiryFailure(400, 'invalid_request', 'The enquiry request is invalid.');
        }
        $errors = [];
        $values = [];
        foreach (['enquiryType' => 40, 'name' => 100, 'email' => 254, 'phone' => 32, 'message' => 4000,
            'website' => 200, 'reference' => 36] as $field => $maximum) {
            $value = $input[$field] ?? '';
            if (!is_string($value) || strlen($value) > $maximum || !preg_match('//u', $value)) {
                $errors[$field] = 'Please check this field and its length.';
                $value = '';
            }
            if ($field === 'message') {
                $value = str_replace(["\r\n", "\r"], "\n", $value);
            }
            $pattern = $field === 'message' ? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/';
            if (preg_match($pattern, $value)) {
                $errors[$field] = 'Please remove unsupported characters.';
            }
            $values[$field] = trim($value);
        }
        if (!in_array($values['enquiryType'], self::TYPES, true)) {
            $errors['enquiryType'] = 'Choose an enquiry type.';
        }
        if ($values['name'] === '') {
            $errors['name'] = 'Enter your name.';
        }
        if (!filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Enter a valid email address.';
        }
        $phoneDigits = preg_match_all('/[0-9]/', $values['phone']);
        if ($values['phone'] !== '' && ($phoneDigits < 6 || !preg_match('/^\+?[0-9 ()-]{6,32}$/D', $values['phone']))) {
            $errors['phone'] = 'Enter a phone number, or leave this field blank.';
        }
        if ($values['message'] === '') {
            $errors['message'] = 'Enter your message.';
        }
        if (!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/D', $values['reference'])) {
            $errors['reference'] = 'Refresh the page before trying again.';
        }
        if ($values['website'] !== '') {
            throw new EnquiryFailure(422, 'invalid_request', 'The enquiry could not be submitted.');
        }
        if ($errors) {
            throw new EnquiryFailure(422, 'validation', 'Please check the highlighted fields.', $errors);
        }
        return $values;
    }

    private function digest(string $value): string
    {
        return hash_hmac('sha256', $value, $this->config['hash_secret']);
    }

    // A separate lock survives atomic state-file replacement. No lock is held over SMTP.
    private function transaction(Closure $operation): mixed
    {
        umask(0077);
        $directory = $this->config['storage_dir'];
        $path = $directory . '/enquiry-state.json';
        $lockPath = $directory . '/enquiry.lock';
        foreach ([$path, $lockPath] as $file) {
            clearstatcache(true, $file);
            if (is_link($file) || (file_exists($file) && (fileperms($file) & 0077) !== 0)) {
                throw enquiryUnavailable();
            }
        }
        $lock = fopen($lockPath, 'c+b');
        if (!$lock) {
            throw enquiryUnavailable();
        }
        $temporary = null;
        try {
            $deadline = microtime(true) + 2;
            while (!flock($lock, LOCK_EX | LOCK_NB)) {
                if (microtime(true) >= $deadline) {
                    throw enquiryUnavailable();
                }
                usleep(20000);
            }
            $state = ['version' => 1, 'rates' => [], 'submissions' => []];
            $raw = null;
            if (file_exists($path)) {
                $raw = file_get_contents($path, false, null, 0, 1048577);
                if ($raw === false || strlen($raw) > 1048576) {
                    throw enquiryUnavailable();
                }
                $state = json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
                if (!is_array($state) || ($state['version'] ?? null) !== 1 ||
                    !is_array($state['rates'] ?? null) || !is_array($state['submissions'] ?? null)) {
                    throw enquiryUnavailable();
                }
            }
            $result = $operation($state);
            $encoded = json_encode($state, JSON_THROW_ON_ERROR);
            if (strlen($encoded) > 1048576) {
                throw enquiryUnavailable();
            }
            if ($encoded === $raw) {
                return $result;
            }
            $temporary = tempnam($directory, '.enquiry-');
            if (!$temporary || dirname($temporary) !== $directory) {
                throw enquiryUnavailable();
            }
            $stream = fopen($temporary, 'wb');
            if (!$stream) {
                throw enquiryUnavailable();
            }
            try {
                if (fwrite($stream, $encoded) !== strlen($encoded) || !fflush($stream) || !fsync($stream)) {
                    throw enquiryUnavailable();
                }
            } finally {
                fclose($stream);
            }
            if (!rename($temporary, $path)) {
                throw enquiryUnavailable();
            }
            $temporary = null;
            return $result;
        } finally {
            if ($temporary && file_exists($temporary)) {
                unlink($temporary);
            }
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    public function rateLimit(string $ip, int $now): void
    {
        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            throw new EnquiryFailure(400, 'invalid_request', 'The enquiry request is invalid.');
        }
        $limited = $this->transaction(function (array &$state) use ($ip, $now): bool {
            foreach ($state['rates'] as $key => $record) {
                if ($record['expires'] <= $now) {
                    unset($state['rates'][$key]);
                }
            }
            foreach ($state['submissions'] as $key => &$record) {
                if ($record['state'] === 'pending' && $record['lease'] <= $now) {
                    $record['state'] = 'unknown';
                    $record['lease'] = 0;
                }
                if ($record['state'] !== 'unknown' && $record['created'] < $now - 86400) {
                    unset($state['submissions'][$key]);
                }
            }
            unset($record);
            if (count($state['submissions']) >= 2000) {
                throw enquiryUnavailable();
            }
            $buckets = [$this->digest('ip:' . $ip) => 5, $this->digest('global') => 100];
            foreach ($buckets as $bucket => $maximum) {
                if (($state['rates'][$bucket]['count'] ?? 0) >= $maximum) {
                    return true;
                }
            }
            foreach ($buckets as $bucket => $maximum) {
                $record = $state['rates'][$bucket] ?? ['count' => 0, 'expires' => $now + 600];
                $record['count']++;
                $state['rates'][$bucket] = $record;
            }
            return false;
        });
        if ($limited) {
            throw new EnquiryFailure(429, 'rate_limit', 'Too many attempts. Please wait ten minutes or call Wash Bar on 0430 455 920.');
        }
    }

    public function submit(array $input, string $ip, ?int $now = null): array
    {
        $now ??= time();
        $this->rateLimit($ip, $now);
        $values = self::validate($input);
        $content = array_intersect_key($values, array_flip(['enquiryType', 'name', 'email', 'phone', 'message']));
        $digest = $this->digest(json_encode($content, JSON_THROW_ON_ERROR));
        $record = $this->transaction(function (array &$state) use ($values, $digest, $now): array {
            $record = $state['submissions'][$values['reference']] ?? null;
            if ($record && !hash_equals($record['digest'], $digest)) {
                throw new EnquiryFailure(409, 'changed_request', 'Keep the original details when retrying, or call Wash Bar.', [], $record['reference']);
            }
            if (!$record) {
                foreach ($state['submissions'] as $candidate) {
                    if (hash_equals($candidate['digest'], $digest)) {
                        $record = $candidate;
                        break;
                    }
                }
            }
            if ($record && $record['state'] === 'accepted') {
                return $record;
            }
            if ($record && $record['state'] === 'unknown') {
                throw new EnquiryFailure(409, 'delivery_uncertain', 'Please call Wash Bar to check this enquiry before sending it again.', [], $record['reference']);
            }
            if ($record && $record['state'] === 'pending') {
                throw new EnquiryFailure(409, 'in_progress', 'This enquiry is still being processed. Please wait before retrying.', [], $record['reference']);
            }
            if (!$record) {
                $record = ['reference' => $values['reference'], 'digest' => $digest, 'created' => $now];
            } elseif ($record['state'] !== 'retryable') {
                throw enquiryUnavailable();
            }
            $record['state'] = 'pending';
            $record['lease'] = $now + 120;
            $state['submissions'][$record['reference']] = $record;
            return $record;
        });
        if ($record['state'] === 'accepted') {
            return ['ok' => true, 'status' => 'accepted', 'reference' => $record['reference']];
        }
        $reference = $record['reference'];
        $text = "New Wash Bar enquiry\nReference: $reference\nSubmitted (UTC): " . gmdate('c', (int) $record['created']) . "\n";
        $labels = ['enquiryType' => 'Enquiry type', 'name' => 'Name', 'email' => 'Email', 'phone' => 'Phone', 'message' => 'Message'];
        foreach ($content as $field => $value) {
            if ($field === 'phone' && $value === '') {
                continue;
            }
            $text .= "\n{$labels[$field]}: $value\n";
        }
        try {
            $accepted = ($this->transport)([
                'from' => 'info@wash-bar.com.au', 'to' => 'info@wash-bar.com.au', 'cc' => 'devald84@gmail.com',
                'reply_to' => $values['email'], 'reply_name' => $values['name'], 'reference' => $reference,
                'subject' => 'New Wash Bar Enquiry ' . "\u{2014}" . ' ' . $values['enquiryType'], 'text' => $text,
            ]);
            if ($accepted !== true) {
                throw new RuntimeException('SMTP acceptance was not confirmed.');
            }
        } catch (EnquiryFailure $error) {
            $this->finish($reference, $error->reason === 'smtp_failure' ? 'retryable' : 'unknown');
            throw new EnquiryFailure(503, $error->reason, $error->getMessage(), [], $reference);
        } catch (Throwable $error) {
            $this->finish($reference, 'unknown');
            throw new EnquiryFailure(503, 'delivery_uncertain', 'We could not confirm submission. Please call Wash Bar on 0430 455 920 before sending again.', [], $reference);
        }
        $this->finish($reference, 'accepted');
        return ['ok' => true, 'status' => 'accepted', 'reference' => $reference];
    }

    private function finish(string $reference, string $state): void
    {
        $this->transaction(static function (array &$data) use ($reference, $state): void {
            $data['submissions'][$reference]['state'] = $state;
            $data['submissions'][$reference]['lease'] = 0;
        });
    }
}
