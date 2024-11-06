// src/services/emailService.js
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const emailService = {
  async sendInvitation(email, invitation) {
    try {
      const invitationLink = `${window.location.origin}/accept-invite/${invitation.token}`;
      
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `Invitation to join ${invitation.companyName} on Carisma CRM`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Welcome to ${invitation.companyName}!</h1>
            <p>You've been invited to join ${invitation.companyName} as a ${invitation.role}.</p>
            <div style="margin: 30px 0;">
              <a href="${invitationLink}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              This invitation will expire in 7 days. If you did not expect this invitation, 
              please ignore this email.
            </p>
          </div>
        `
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      throw new Error('Failed to send invitation email. Please try again.');
    }
  }
};