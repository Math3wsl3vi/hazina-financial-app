'use server';

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Appointment System" <${process.env.FROM_EMAIL}>`,
      ...options,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { error: 'Failed to send email' };
  }
}

export async function sendAppointmentNotification(
  advisorEmail: string,
  appointment: {
    userName?: string;
    date: string;
    time: string;
    notes?: string;
  }
) {
  return sendEmail({
    to: advisorEmail,
    subject: 'New Appointment Booked',
    text: `You have a new appointment with ${appointment.userName || 'a client'} on ${appointment.date} at ${appointment.time}.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Appointment Scheduled</h2>
        <p><strong>Client:</strong> ${appointment.userName || 'Not specified'}</p>
        <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
        <p style="margin-top: 20px;">Please review your schedule.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p>Best regards,</p>
          <p>Your Appointment Team</p>
        </div>
      </div>
    `,
  });
}