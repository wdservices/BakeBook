const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
admin.initializeApp();

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred email service
  auth: {
    user: 'YOUR_EMAIL@gmail.com', // Your email
    pass: 'YOUR_APP_PASSWORD' // Your app password (not your regular password)
  }
});

// Cloud Function triggered when a new user signs up
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const email = user.email;
  const displayName = user.displayName || 'BakeBook User';

  // Email options
  const mailOptions = {
    from: 'BakeBook <noreply@bakebook.com>',
    to: email,
    subject: 'Welcome to BakeBook!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e67e22;">Welcome to BakeBook, ${displayName}!</h1>
        <p>Thank you for joining our community of bakers and food enthusiasts. We're excited to have you on board!</p>
        <p>With BakeBook, you can:</p>
        <ul>
          <li>Save and organize your favorite recipes</li>
          <li>Discover new baking ideas</li>
          <li>Share your culinary creations</li>
        </ul>
        <p>Happy Baking!<br>The BakeBook Team</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          You're receiving this email because you signed up for BakeBook. If this wasn't you, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
    return null;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return null;
  }
});
