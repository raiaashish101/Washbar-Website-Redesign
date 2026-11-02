<?php
declare(strict_types=1);

// Failure-only fixtures: no SMTP connections, secrets or fabricated email acceptance.
require_once dirname(__DIR__) . '/api/enquiry-service.php';
if (PHP_VERSION_ID < 80200) {
    fwrite(STDERR, "Required: PHP 8.2+. Tests not run.\n");
    exit(1);
}

$passed = 0;
$directories = [];
function check(bool $condition, string $message): void
{
    global $passed;
    if (!$condition) throw new RuntimeException($message);
    $passed++;
}
function failure(Closure $operation, string $reason, int $status): EnquiryFailure
{
    try {
        $operation();
    } catch (EnquiryFailure $error) {
        check($error->reason === $reason && $error->httpStatus === $status, "Unexpected failure: {$error->reason}");
        return $error;
    }
    throw new RuntimeException("Expected rejection: $reason");
}
function input(): array
{
    return ['enquiryType' => 'Commercial laundry', 'name' => 'QA Customer',
        'email' => 'qa@example.invalid', 'phone' => '', 'message' => "TEST ONLY\nDo not send this fixture.",
        'website' => '', 'reference' => '11111111-1111-4111-8111-111111111111'];
}
function service(?Closure $transport = null): array
{
    global $directories;
    $directory = sys_get_temp_dir() . '/washbar-test-' . bin2hex(random_bytes(8));
    mkdir($directory, 0700);
    $directories[] = $directory;
    $config = ['storage_dir' => $directory, 'hash_secret' => str_repeat('a', 64)];
    $transport ??= static function (): never { throw new RuntimeException('SMTP must not run in this suite.'); };
    return [new WashBarEnquiry($config, $transport), $directory . '/enquiry-state.json'];
}
function state(string $file): array
{
    return json_decode(file_get_contents($file), true, 8, JSON_THROW_ON_ERROR);
}

try {
    $template = require dirname(__DIR__) . '/docs/enquiry-config.example.php';
    check($template['smtp_host'] === 'mail.wash-bar.com.au', 'Mailbox address used as SMTP host.');
    check($template['smtp_username'] === 'info@wash-bar.com.au', 'Template uses the obsolete mailbox.');
    check($template['enabled'] === false && $template['smtp_confirmed'] === false, 'Template must fail closed.');
    check($template['smtp_password'] === '' && $template['hash_secret'] === '', 'Template must not contain secrets.');
    check($template['phpmailer_dir'] === '/home1/washbarc/private/washbar-enquiry/PHPMailer', 'Private path casing changed.');

    // Invalid identities must fail before library loading, without any SMTP connection.
    $bootstrap = sys_get_temp_dir() . '/washbar-bootstrap-' . bin2hex(random_bytes(8));
    mkdir($bootstrap, 0700);
    mkdir($bootstrap . '/src', 0700);
    $directories[] = $bootstrap;
    file_put_contents($bootstrap . '/src/Exception.php',
        '<?php throw new RuntimeException("Invalid identity reached library loading.");');
    $fixture = array_replace($template, ['enabled' => true, 'smtp_confirmed' => true,
        'smtp_password' => 'not-a-real-password', 'hash_secret' => str_repeat('b', 64),
        'storage_dir' => $bootstrap, 'phpmailer_dir' => $bootstrap]);
    $previousConfig = getenv('WASHBAR_ENQUIRY_CONFIG');
    try {
        putenv('WASHBAR_ENQUIRY_CONFIG=' . $bootstrap . '/config.php');
        foreach ([['smtp_host' => 'info@wash-bar.com.au'], ['smtp_host' => 'smtp.example.invalid'],
            ['smtp_username' => 'mail@wash-bar.com.au']] as $invalid) {
            file_put_contents($bootstrap . '/config.php', '<?php return ' . var_export(array_replace($fixture, $invalid), true) . ';');
            chmod($bootstrap . '/config.php', 0600);
            clearstatcache();
            failure(fn () => enquiryConfig(), 'unavailable', 503);
        }
    } finally {
        putenv($previousConfig === false ? 'WASHBAR_ENQUIRY_CONFIG' : 'WASHBAR_ENQUIRY_CONFIG=' . $previousConfig);
    }

    check(WashBarEnquiry::validate(input())['phone'] === '', 'Optional phone rejected.');
    foreach (WashBarEnquiry::TYPES as $type) {
        check(WashBarEnquiry::validate(array_replace(input(), ['enquiryType' => $type]))['enquiryType'] === $type, 'Approved type rejected.');
    }
    foreach (['0430 455 920', '+61 (430) 455-920', '+1 (609) 555-0123'] as $phone) {
        check(WashBarEnquiry::validate(array_replace(input(), ['phone' => $phone]))['phone'] === $phone, 'Formatted phone rejected.');
    }
    foreach (['------', '()()()', '+     ', '1-2-3-4-5'] as $phone) {
        $error = failure(fn () => WashBarEnquiry::validate(array_replace(input(), ['phone' => $phone])), 'validation', 422);
        check(isset($error->fields['phone']), 'Missing phone error.');
    }
    foreach (['name' => '', 'email' => 'invalid', 'message' => '', 'enquiryType' => 'Wash & Fold',
        'phone' => 'arbitrary-text', 'reference' => 'not-a-uuid'] as $field => $value) {
        $error = failure(fn () => WashBarEnquiry::validate(array_replace(input(), [$field => $value])), 'validation', 422);
        check(isset($error->fields[$field]), "Missing error: $field");
    }
    foreach (['name', 'email', 'phone', 'enquiryType'] as $field) {
        failure(fn () => WashBarEnquiry::validate(array_replace(input(), [$field => input()[$field] . "\r\n"])), 'validation', 422);
    }
    failure(fn () => WashBarEnquiry::validate(array_replace(input(), ['name' => str_repeat('a', 101)])), 'validation', 422);
    failure(fn () => WashBarEnquiry::validate(array_replace(input(), ['name' => str_repeat("\xc3\xa9", 51)])), 'validation', 422);
    failure(fn () => WashBarEnquiry::validate(array_replace(input(), ['message' => "bad\x00text"])), 'validation', 422);
    failure(fn () => WashBarEnquiry::validate(array_replace(input(), ['name' => ['bad']])), 'validation', 422);
    failure(fn () => WashBarEnquiry::validate(array_replace(input(), ['website' => 'bot'])), 'invalid_request', 422);
    foreach (['to', 'cc', 'from', 'reply_to', 'subject'] as $field) {
        failure(fn () => WashBarEnquiry::validate(input() + [$field => 'attacker@example.invalid']), 'invalid_request', 400);
    }

    $now = time();
    [$limiter, $file] = service();
    for ($i = 0; $i < 5; $i++) $limiter->rateLimit('192.0.2.1', $now);
    for ($i = 0; $i < 10; $i++) failure(fn () => $limiter->rateLimit('192.0.2.1', $now), 'rate_limit', 429);
    check(max(array_column(state($file)['rates'], 'count')) === 5, 'Rejected IP exhausted global quota.');
    $limiter->rateLimit('192.0.2.2', $now);
    $limiter->rateLimit('192.0.2.1', $now + 600);
    failure(fn () => $limiter->rateLimit('spoofed-forwarding-header', $now), 'invalid_request', 400);
    check((fileperms($file) & 0077) === 0, 'State permissions expose metadata.');

    [$limiter] = service();
    for ($i = 1; $i <= 100; $i++) $limiter->rateLimit("192.0.2.$i", $now);
    failure(fn () => $limiter->rateLimit('192.0.2.101', $now), 'rate_limit', 429);

    $calls = [];
    [$client, $file] = service(static function ($message) use (&$calls): never {
        $calls[] = $message;
        throw new EnquiryFailure(503, 'smtp_failure', 'Fixture authentication failure before DATA.');
    });
    failure(fn () => $client->submit(input(), '192.0.2.1', $now), 'smtp_failure', 503);
    failure(fn () => $client->submit(input(), '192.0.2.1', $now + 1), 'smtp_failure', 503);
    check($calls[0] === $calls[1], 'Known rejection changed the retry content/reference.');
    check($calls[0]['from'] === 'info@wash-bar.com.au' && $calls[0]['to'] === 'info@wash-bar.com.au', 'Incorrect From/To.');
    check($calls[0]['cc'] === 'devald84@gmail.com', 'Incorrect CC.');
    check($calls[0]['reply_to'] === input()['email'], 'Incorrect Reply-To.');
    check($calls[0]['subject'] === 'New Wash Bar Enquiry ' . "\u{2014}" . ' Commercial laundry', 'Incorrect subject.');
    check(!isset($calls[0]['html']), 'Email must remain plain text.');
    foreach (['QA Customer', input()['email'], input()['message'], '192.0.2.1'] as $raw) {
        check(!str_contains(file_get_contents($file), $raw), 'Personal data persisted in state.');
    }
    failure(fn () => $client->submit(array_replace(input(), ['name' => 'Changed']), '192.0.2.1', $now + 2), 'changed_request', 409);
    check(count($calls) === 2, 'Changed reference reached SMTP.');

    $attempts = 0;
    [$client, $file] = service(static function () use (&$attempts): never {
        $attempts++;
        throw new RuntimeException('Fixture lost DATA acknowledgement.');
    });
    failure(fn () => $client->submit(input(), '192.0.2.1', $now), 'delivery_uncertain', 503);
    failure(fn () => $client->submit(input(), '192.0.2.1', $now + 1), 'delivery_uncertain', 409);
    failure(fn () => $client->submit(array_replace(input(), [
        'reference' => '22222222-2222-4222-8222-222222222222',
    ]), '192.0.2.9', $now + 90000), 'delivery_uncertain', 409);
    check($attempts === 1, 'Unknown delivery was automatically sent again.');

    [$client] = service(static fn (): bool => false);
    failure(fn () => $client->submit(input(), '192.0.2.1', $now), 'delivery_uncertain', 503);

    [$client, $file] = service();
    $pending = state($file);
    $pending['submissions']['stale'] = ['reference' => 'stale', 'digest' => 'digest', 'created' => $now - 90000,
        'state' => 'pending', 'lease' => $now - 1];
    file_put_contents($file, json_encode($pending));
    $client->rateLimit('192.0.2.1', $now);
    check(state($file)['submissions']['stale']['state'] === 'unknown', 'Expired pending request erased.');

    [$client, $file] = service();
    chmod($file, 0644);
    failure(fn () => $client->rateLimit('192.0.2.1', $now), 'unavailable', 503);
    chmod($file, 0600);
    file_put_contents($file, '{corrupt');
    try {
        $client->rateLimit('192.0.2.1', $now);
        throw new RuntimeException('Corrupt state was reset instead of rejected.');
    } catch (JsonException $error) {
        check(file_get_contents($file) === '{corrupt', 'Corrupt state overwritten.');
    }
    [$client, $file] = service();
    $full = state($file);
    for ($i = 0; $i < 2000; $i++) {
        $full['submissions']["fixture-$i"] = ['reference' => "fixture-$i", 'digest' => 'digest',
            'created' => $now, 'state' => 'unknown', 'lease' => 0];
    }
    file_put_contents($file, json_encode($full));
    failure(fn () => $client->rateLimit('192.0.2.1', $now), 'unavailable', 503);
    fwrite(STDOUT, "$passed assertions passed. No SMTP connection, email delivery or accepted response was simulated.\n");
} finally {
    foreach ($directories as $directory) {
        $entries = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($entries as $entry) {
            if ($entry->isDir()) rmdir($entry->getPathname());
            else unlink($entry->getPathname());
        }
        rmdir($directory);
    }
}
