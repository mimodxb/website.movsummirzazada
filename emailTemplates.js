export const emailTemplates = {
  intakeConfirmationEmail: (reference, tier, estimatedDelivery) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #E0A995;">Legal Complaint Intake Received</h2>
      <p>Dear Client,</p>
      <p>Thank you for submitting your case details. We have successfully received your intake form.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Reference ID:</strong> ${reference}</p>
        <p><strong>Selected Tier:</strong> ${tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
        <p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
      </div>

      <p>Our team will review your case and get back to you shortly. You can track your status in your dashboard.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      
      <div style="font-size: 12px; color: #999;">
        <p>
          By using this service, you agree to our <a href="https://movsummirzazada.com/terms-and-conditions" style="color: #E0A995;">Terms & Conditions</a> and <a href="https://movsummirzazada.com/payment-terms" style="color: #E0A995;">Payment Terms</a>.
        </p>
        <p>
          <strong>Disclaimer:</strong> This service provides Non-Lawyer Documentation & Process Support only. We do not provide legal representation or legal advice.
        </p>
      </div>
    </div>
  `,

  intakeNotificationEmail: (formData) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #333;">New Legal Complaint Intake</h2>
      <p><strong>Ref:</strong> ${formData.reference_id}</p>
      <p><strong>Client:</strong> ${formData.full_name} (${formData.email})</p>
      <p><strong>Tier:</strong> ${formData.pricing_tier}</p>
      <p><strong>Type:</strong> ${formData.issue_type}</p>
      <p><strong>Priority:</strong> ${formData.response_time}</p>
      <hr />
      <h3>Description:</h3>
      <p>${formData.situation_description}</p>
      <a href="https://movsummirzazada.com/admin" style="display: inline-block; padding: 10px 20px; background-color: #E0A995; color: white; text-decoration: none; border-radius: 4px;">View in Admin</a>
    </div>
  `,

  statusUpdateEmail: (reference, status, notes) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
      <h2 style="color: #E0A995;">Case Status Update</h2>
      <p>Your legal complaint case (Ref: <strong>${reference}</strong>) has been updated.</p>
      
      <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #E0A995; margin: 20px 0;">
        <p><strong>New Status:</strong> ${status.replace('_', ' ').toUpperCase()}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      </div>
      
      <p>Please log in to your dashboard for more details.</p>
    </div>
  `
};