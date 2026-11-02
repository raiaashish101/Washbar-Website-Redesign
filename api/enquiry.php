<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
require_once __DIR__ . '/enquiry-service.php';

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        throw new EnquiryFailure(405, 'method', 'Use POST to submit an enquiry.');
    }
    if (strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') {
        throw new EnquiryFailure(415, 'content_type', 'Use the enquiry form, or call Wash Bar on 0430 455 920.');
    }
    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) {
        throw new EnquiryFailure(413, 'request_size', 'Your enquiry is too long. Please shorten the message.');
    }
    $stream = fopen('php://input', 'rb');
    if (!$stream) {
        throw enquiryUnavailable();
    }
    $raw = stream_get_contents($stream, 16385);
    fclose($stream);
    if ($raw === false || strlen($raw) > 16384) {
        throw new EnquiryFailure(413, 'request_size', 'Your enquiry is too long. Please shorten the message.');
    }
    try {
        $input = json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
    } catch (JsonException $error) {
        throw new EnquiryFailure(400, 'invalid_request', 'The enquiry request is invalid.');
    }
    if (!is_array($input) || !str_starts_with(ltrim($raw), '{')) {
        throw new EnquiryFailure(400, 'invalid_request', 'The enquiry request is invalid.');
    }
    $config = enquiryConfig();
    if (!in_array($_SERVER['HTTP_ORIGIN'] ?? '', $config['allowed_origins'], true)) {
        throw new EnquiryFailure(403, 'origin', 'Submit your enquiry from the Wash Bar website.');
    }
    $service = new WashBarEnquiry($config);
    $result = $service->submit($input, $_SERVER['REMOTE_ADDR'] ?? '');
    http_response_code(200);
} catch (EnquiryFailure $error) {
    http_response_code($error->httpStatus);
    if ($error->httpStatus === 429) {
        header('Retry-After: 600');
    }
    $result = ['ok' => false, 'code' => $error->reason, 'message' => $error->getMessage(),
        'errors' => (object) $error->fields, 'reference' => $error->reference];
} catch (Throwable $error) {
    // Do not log request bodies, customer data, API keys or provider responses.
    error_log('[washbar-enquiry] internal failure; investigate private configuration/storage');
    http_response_code(503);
    $result = ['ok' => false, 'code' => 'unavailable',
        'message' => 'Online enquiries are unavailable. Please call Wash Bar on 0430 455 920.'];
}
echo json_encode($result, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
