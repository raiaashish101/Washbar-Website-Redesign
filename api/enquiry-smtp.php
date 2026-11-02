<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

ini_set('display_errors', '0');
if (!class_exists(SMTP::class, false)) {
    http_response_code(404);
    exit;
}

// Stop before DATA if either recipient is rejected; PHPMailer normally permits partial sends.
final class EnquirySMTP extends SMTP
{
    public bool $dataAttempted = false;
    public bool $dataAccepted = false;
    private int $acceptedRecipients = 0;
    private float $deadline;

    public function __construct()
    {
        $this->deadline = microtime(true) + 25;
        $this->Timeout = 5;
        $this->Timelimit = 5;
    }

    protected function sendCommand($command, $commandstring, $expect)
    {
        $remaining = $this->deadline - microtime(true);
        if ($remaining <= 0) {
            throw new MailException('SMTP time budget exceeded.');
        }
        $this->Timeout = $this->Timelimit = max(1, min(5, (int) ceil($remaining)));
        return parent::sendCommand($command, $commandstring, $expect);
    }

    public function recipient($address, $dsn = '')
    {
        if (!parent::recipient($address, $dsn)) {
            throw new MailException('A required SMTP recipient was rejected.');
        }
        $this->acceptedRecipients++;
        return true;
    }

    public function data($msg_data)
    {
        if ($this->acceptedRecipients !== 2) {
            throw new MailException('Both SMTP recipients must be accepted before DATA.');
        }
        $this->dataAttempted = true;
        $this->dataAccepted = parent::data($msg_data) === true;
        return $this->dataAccepted;
    }
}

function enquirySendSMTP(array $config, array $message): bool
{
    $smtp = new EnquirySMTP();
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->setSMTPInstance($smtp);
    $mail->SMTPAuth = true;
    $mail->SMTPDebug = SMTP::DEBUG_OFF;
    $mail->Host = $config['smtp_host'];
    $mail->Port = $config['smtp_port'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->Timeout = 5;
    $mail->SMTPOptions = ['ssl' => [
        'verify_peer' => true, 'verify_peer_name' => true, 'allow_self_signed' => false,
        'peer_name' => $config['smtp_host'],
    ]];
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Encoding = PHPMailer::ENCODING_BASE64;
    $mail->isHTML(false);
    $mail->setFrom($message['from'], 'Wash Bar Enquiries');
    $mail->addAddress($message['to']);
    $mail->addCC($message['cc']);
    $mail->addReplyTo($message['reply_to'], $message['reply_name']);
    $mail->MessageID = '<washbar-' . $message['reference'] . '@wash-bar.com.au>';
    $mail->Subject = $message['subject'];
    $mail->Body = $message['text'];
    try {
        $mail->send();
    } catch (Throwable $error) {
        if (!$smtp->dataAccepted) {
            throw new EnquiryFailure(503, $smtp->dataAttempted ? 'delivery_uncertain' : 'smtp_failure',
                $smtp->dataAttempted ? 'We could not confirm submission. Please call Wash Bar on 0430 455 920 before sending again.' :
                "We couldn't send your enquiry. Please try again or call Wash Bar on 0430 455 920.");
        }
    } finally {
        $smtp->close();
    }
    return $smtp->dataAccepted;
}
