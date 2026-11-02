<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
require_once __DIR__ . '/enquiry-service.php';

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        header('Allow: GET');
        throw new EnquiryFailure(405, 'method', 'Use GET to check enquiry availability.');
    }
    $config = enquiryConfig();
    new WashBarEnquiry($config);
    // Never include SMTP credentials, recipient addresses or private paths.
    $result = ['available' => true];
} catch (EnquiryFailure $error) {
    http_response_code($error->httpStatus);
    $result = ['available' => false];
} catch (Throwable $error) {
    http_response_code(503);
    $result = ['available' => false];
}
echo json_encode($result);
