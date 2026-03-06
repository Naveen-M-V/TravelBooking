import nodemailer from 'nodemailer'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@halaltravels.com'

function createTransporter() {
  // If SMTP credentials are configured, use them; otherwise log to console (dev mode)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  // Development fallback — logs emails to console
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  })
}

const sendMail = async (options: nodemailer.SendMailOptions) => {
  try {
    const transporter = createTransporter()
    const info = await transporter.sendMail(options)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Email] To: ${options.to} | Subject: ${options.subject}`)
    }
    return info
  } catch (err) {
    console.error('[Email] Failed to send:', err)
  }
}

export class EmailService {
  /** Notify admin when a new package enquiry is submitted */
  static async sendEnquiryNotificationToAdmin(enquiry: any) {
    const dashboardLink = `${FRONTEND_URL}/dashboard/admin/enquiries`
    await sendMail({
      from: `"Halal Travels" <noreply@halaltravels.com>`,
      to: ADMIN_EMAIL,
      subject: `New Package Enquiry: ${enquiry.packageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Enquiry Received</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Package</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${enquiry.packageName}</td></tr>
            <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Destination</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${enquiry.packageDestination}</td></tr>
            <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Customer</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${enquiry.customerName}</td></tr>
            <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Email</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${enquiry.customerEmail}</td></tr>
            <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Phone</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${enquiry.customerPhone}</td></tr>
            <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Travel Date</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${enquiry.travelDate ? new Date(enquiry.travelDate).toLocaleDateString() : 'Flexible'}</td></tr>
            <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Travelers</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${enquiry.adults} Adults, ${enquiry.children} Children, ${enquiry.infants} Infants</td></tr>
            ${enquiry.specialRequests ? `<tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Special Requests</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${enquiry.specialRequests}</td></tr>` : ''}
          </table>
          <p style="margin-top:20px;">
            <a href="${dashboardLink}" style="background:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; display:inline-block;">
              Review in Dashboard
            </a>
          </p>
        </div>
      `,
    })
  }

  /** Confirm enquiry receipt to customer */
  static async sendEnquiryConfirmation(enquiry: any) {
    await sendMail({
      from: `"Halal Travels" <noreply@halaltravels.com>`,
      to: enquiry.customerEmail,
      subject: `Enquiry Received – ${enquiry.packageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You for Your Enquiry!</h2>
          <p>Dear ${enquiry.customerName},</p>
          <p>We have received your enquiry for <strong>${enquiry.packageName}</strong> to <strong>${enquiry.packageDestination}</strong>.</p>
          <p>Our team will review your request and send you a personalised quote within 24 hours.</p>
          <p><strong>Enquiry Reference:</strong> ${enquiry.id.slice(0, 8).toUpperCase()}</p>
          <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
          <p style="color:#6b7280; font-size:14px;">If you have any questions, please contact us at support@halaltravels.com</p>
        </div>
      `,
    })
  }

  /** Send admin's quote to the customer */
  static async sendQuoteToCustomer(enquiry: any) {
    const dashboardLink = `${FRONTEND_URL}/dashboard/customer/enquiries`
    const totalFormatted = new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: enquiry.currency || 'SAR',
    }).format(Number(enquiry.totalPrice))

    await sendMail({
      from: `"Halal Travels" <noreply@halaltravels.com>`,
      to: enquiry.customerEmail,
      subject: `Your Quote is Ready – ${enquiry.packageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Quote is Ready!</h2>
          <p>Dear ${enquiry.customerName},</p>
          <p>We have prepared a personalised quote for your <strong>${enquiry.packageName}</strong> package.</p>
          <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:20px; margin:20px 0; text-align:center;">
            <p style="font-size:14px; color:#6b7280; margin:0 0 8px;">Total Package Price</p>
            <p style="font-size:36px; font-weight:bold; color:#2563eb; margin:0;">${totalFormatted}</p>
            ${enquiry.adminNotes ? `<p style="font-size:14px; color:#374151; margin-top:12px;">${enquiry.adminNotes}</p>` : ''}
          </div>
          <p>This quote is valid until <strong>${enquiry.quoteValidUntil ? new Date(enquiry.quoteValidUntil).toLocaleDateString() : '7 days'}</strong>.</p>
          <p style="margin-top:20px;">
            <a href="${dashboardLink}" style="background:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; display:inline-block;">
              View Quote &amp; Proceed to Payment
            </a>
          </p>
          <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
          <p style="color:#6b7280; font-size:14px;">Payment is securely processed via CCAvenue.</p>
        </div>
      `,
    })
  }

  /** Notify customer that their booking is confirmed after payment */
  static async sendBookingConfirmation(enquiry: any) {
    await sendMail({
      from: `"Halal Travels" <noreply@halaltravels.com>`,
      to: enquiry.customerEmail,
      subject: `Booking Confirmed – ${enquiry.packageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Booking Confirmed! 🎉</h2>
          <p>Dear ${enquiry.customerName},</p>
          <p>Your booking for <strong>${enquiry.packageName}</strong> is confirmed. Our team will reach out soon with full itinerary details.</p>
          <p><strong>Booking Reference:</strong> ${enquiry.id.slice(0, 8).toUpperCase()}</p>
          <p><strong>Order ID:</strong> ${enquiry.ccavenueOrderId}</p>
          <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
          <p style="color:#6b7280; font-size:14px;">Thank you for choosing Halal Travels!</p>
        </div>
      `,
    })
  }

  /** Send email verification link to newly registered user */
  static async sendVerificationEmail(email: string, firstName: string, token: string) {
    const verifyLink = `${FRONTEND_URL}/verify-email?token=${token}`
    await sendMail({
      from: `"Halal Travels" <noreply@halaltravels.com>`,
      to: email,
      subject: 'Verify your Halal Travels account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">Welcome to Halal Travels! 🌍</h2>
          <p>Hi ${firstName},</p>
          <p>Thanks for signing up. Please verify your email address by clicking the button below.</p>
          <p style="margin: 28px 0;">
            <a href="${verifyLink}" style="background:#0d9488; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; display:inline-block; font-weight:bold;">
              Verify Email Address
            </a>
          </p>
          <p style="color:#6b7280; font-size:13px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
          <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
          <p style="color:#9ca3af; font-size:12px;">Or copy this link: ${verifyLink}</p>
        </div>
      `,
    })
  }

  /** Send admin invite email with set-password link */
  static async sendAdminInviteEmail(email: string, token: string) {
    const inviteLink = `${FRONTEND_URL}/invite?token=${token}`
    await sendMail({
      from: `"Halal Travels" <noreply@halaltravels.com>`,
      to: email,
      subject: `You've been invited as a Halal Travels Admin`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">Admin Invitation – Halal Travels</h2>
          <p>You have been invited to manage the Halal Travels platform as an <strong>Admin</strong>.</p>
          <p>Click the button below to set your password and activate your account.</p>
          <p style="margin: 28px 0;">
            <a href="${inviteLink}" style="background:#0d9488; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; display:inline-block; font-weight:bold;">
              Accept Invitation &amp; Set Password
            </a>
          </p>
          <p style="color:#6b7280; font-size:13px;">This invite link expires in 48 hours.</p>
          <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
          <p style="color:#9ca3af; font-size:12px;">Or copy this link: ${inviteLink}</p>
        </div>
      `,
    })
  }

  /** Send supplier inquiry (without customer personal details) */
  static async sendSupplierInquiry(
    supplierEmail: string,
    supplierName: string,
    enquiry: any
  ) {
    await sendMail({
      from: `"Halal Travels" <noreply@halaltravels.com>`,
      to: supplierEmail,
      subject: `Package Inquiry: ${enquiry.packageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Package Inquiry</h2>
          <p>Hi ${supplierName},</p>
          <p>We have received an inquiry for <strong>${enquiry.packageName}</strong> to <strong>${enquiry.packageDestination}</strong>.</p>
          
          <div style="background:#f3f4f6; border-left:4px solid #2563eb; padding:16px; margin:20px 0; border-radius:4px;">
            <p style="margin:0 0 8px 0;"><strong>Destination:</strong> ${enquiry.packageDestination}</p>
            <p style="margin:0 0 8px 0;"><strong>Travel Date:</strong> ${enquiry.travelDate ? new Date(enquiry.travelDate).toLocaleDateString() : 'Flexible'}</p>
            <p style="margin:0 0 8px 0;"><strong>Travelers:</strong> ${enquiry.adults} Adults, ${enquiry.children} Children, ${enquiry.infants} Infants</p>
            <p style="margin:0;"><strong>Total Persons:</strong> ${enquiry.adults + enquiry.children + enquiry.infants}</p>
          </div>

          <p style="color:#6b7280; font-size:13px;">
            <strong>Inquiry Reference:</strong> ${enquiry.id.slice(0, 8).toUpperCase()}
          </p>
          <p style="color:#6b7280; font-size:13px;">
            Please provide your quotation for this package. Reply to this email with your cost estimate.
          </p>
          <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
          <p style="color:#9ca3af; font-size:12px;">This is an automated email. Do not reply with customer information.</p>
        </div>
      `,
    })
  }
}
