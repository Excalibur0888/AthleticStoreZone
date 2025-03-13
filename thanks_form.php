<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Set recipient email
    $to = "contact@athleticstorezone.com";
    
    // Determine form type and set appropriate variables
    if (isset($_POST["form_type"])) {
        $form_type = $_POST["form_type"];
        
        if ($form_type == "newsletter") {
            // Newsletter form
            $email = isset($_POST["email"]) ? $_POST["email"] : "";
            
            $subject = "Newsletter Subscription";
            $body = "New newsletter subscription\n\n";
            $body .= "Email: $email\n";
            $body .= "Date: " . date("Y-m-d H:i:s") . "\n";
            $body .= "Subscription confirmed with privacy policy consent\n";
            
            $headers = "From: $to\r\n";
            $headers .= "Reply-To: $email\r\n";
        } 
        elseif ($form_type == "contact") {
            // Contact form
            $name = isset($_POST["name"]) ? $_POST["name"] : "";
            $email = isset($_POST["email"]) ? $_POST["email"] : "";
            $phone = isset($_POST["phone"]) ? $_POST["phone"] : "";
            $message = isset($_POST["message"]) ? $_POST["message"] : "";
            
            $subject = "Contact Form Submission";
            $body = "New contact form submission\n\n";
            $body .= "Name: $name\n";
            $body .= "Email: $email\n";
            $body .= "Phone: $phone\n";
            $body .= "Message: $message\n";
            $body .= "Date: " . date("Y-m-d H:i:s") . "\n";
            
            $headers = "From: $to\r\n";
            $headers .= "Reply-To: $email\r\n";
        }
        
        // Send email
        mail($to, $subject, $body, $headers);
        
        // Redirect to thank you page
        header("Location: thanks.html");
        exit();
    }
}
?>
