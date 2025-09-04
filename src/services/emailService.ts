// Email service placeholder - integrate with your email provider
export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  // This would integrate with services like SendGrid, Mailgun, or AWS SES
  console.log('Email would be sent to:', to);
  console.log('Subject:', subject);
  console.log('Content:', htmlContent);
  
  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, messageId: `msg-${Date.now()}` });
    }, 1000);
  });
};

export const sendLeadNotificationEmails = async (customerData: any) => {
  const customerEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">Thank you for your interest in Life Insurance!</h2>
      <p>Dear ${customerData.name},</p>
      <p>We have received your inquiry about life insurance. Our experienced insurance consultant will contact you shortly to discuss your requirements and help you find the perfect policy.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151;">Your submitted details:</h3>
        <p><strong>Name:</strong> ${customerData.name}</p>
        <p><strong>Email:</strong> ${customerData.email}</p>
        <p><strong>Mobile:</strong> ${customerData.mobile}</p>
        <p><strong>Date of Birth:</strong> ${customerData.dob}</p>
      </div>
      <p>If you have any immediate questions, please don't hesitate to reach out to us.</p>
      <p>Best regards,<br>Life Insurance Team</p>
    </div>
  `;

  const adminEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">New Lead Generated!</h2>
      <p>A new customer has submitted a lead form on the website.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151;">Customer Details:</h3>
        <p><strong>Name:</strong> ${customerData.name}</p>
        <p><strong>Email:</strong> ${customerData.email}</p>
        <p><strong>Mobile:</strong> ${customerData.mobile}</p>
        <p><strong>Date of Birth:</strong> ${customerData.dob}</p>
        <p><strong>Submitted At:</strong> ${new Date(customerData.submittedAt).toLocaleString()}</p>
      </div>
      <p>Please follow up with this lead promptly.</p>
    </div>
  `;

  try {
    await Promise.all([
      sendEmail(customerData.email, 'Thank you for your Life Insurance inquiry', customerEmail),
      sendEmail('admin@lifeinsurance.com', 'New Lead Generated', adminEmail)
    ]);
  } catch (error) {
    console.error('Error sending emails:', error);
  }
};