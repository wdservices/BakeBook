import { NextResponse } from 'next/server';
import * as sgMail from '@sendgrid/mail';

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { to, from, subject, text } = await request.json();

    const msg = {
      to: to || 'hello.wdservices@gmail.com',
      from: from || 'noreply@bakebook.app', // Use a verified sender
      subject: subject || 'New Contact Form Submission',
      text: text || 'No message content provided',
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
