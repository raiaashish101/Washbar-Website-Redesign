<?php
// TEMPLATE ONLY. Never overwrite an already configured private server copy.
return [
    'enabled' => false,
    'smtp_confirmed' => false, // Enable privately for authorised testing; not evidence of delivery.
    'smtp_host' => 'mail.wash-bar.com.au',
    'smtp_port' => 465,
    'smtp_encryption' => 'ssl', // Implicit TLS / SMTPS, not STARTTLS.
    'smtp_username' => 'info@wash-bar.com.au',
    'smtp_password' => '', // Real value belongs only in the existing private cPanel config.
    'phpmailer_dir' => '/home1/washbarc/private/washbar-enquiry/PHPMailer',
    'hash_secret' => '', // Preserve the existing private value and submission state.
    'storage_dir' => '/home1/washbarc/private/washbar-enquiry/storage',
    'allowed_origins' => ['https://wash-bar.com.au'],
];
