<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get email from newsletter form
    $email = isset($_POST["email"]) ? $_POST["email"] : "";
    
    // Set recipient email
    $to = "contact@athleticstorezone.com";
    
    // Set email subject based on form type
    $subject = "Newsletter Subscription";
    
    // Create email body
    $body = "New newsletter subscription\n\n";
    $body .= "Email: $email\n";
    $body .= "Date: " . date("Y-m-d H:i:s") . "\n";
    $body .= "Subscription confirmed with privacy policy consent\n";
    
    // Set headers
    $headers = "From: $to\r\n";
    $headers .= "Reply-To: $email\r\n";
    
    // Send email
    mail($to, $subject, $body, $headers);
    
    // Redirect to thank you page
    header("Location: thanks.html");
    exit();
}
?>
