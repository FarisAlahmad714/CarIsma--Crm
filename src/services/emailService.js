import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

const API_URL = import.meta.env.DEV 
  ? '/api/resend/emails'  // Development (proxied)
  : 'https://api.resend.com/emails'; // Production

export const emailService = {
  async sendInvitation(email, invitation) {
    try {
      console.log('Sending email to:', email);
      
      const invitationLink = `${window.location.origin}/accept-invite/${invitation.token}`;
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
                This invitation will expire in 7 days.
              </p>
            </div>
          `
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send email');
      }

      console.log('Email sent successfully:', data);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('Email service error:', error);
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }
  }
};

// Make it available globally for testing
window.emailService = emailService;