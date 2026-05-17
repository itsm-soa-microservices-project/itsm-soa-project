const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  NOTIFICATION_EMAIL_FROM,
  NOTIFICATION_EMAIL_TO
} = process.env;

let transporter = null;

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

const sendEmailNotification = async (eventType, payload, text) => {
  if (!transporter || !NOTIFICATION_EMAIL_FROM || !NOTIFICATION_EMAIL_TO) {
    console.log("[Email Notification] SMTP not configured, using console only.");
    console.log(text);
    return;
  }

  const subject = `ITSM ${eventType.toUpperCase()} notification`;

  const mail = {
    from: NOTIFICATION_EMAIL_FROM,
    to: NOTIFICATION_EMAIL_TO,
    subject,
    text,
    html: `<p>${text}</p><pre>${JSON.stringify(payload, null, 2)}</pre>`
  };

  try {
    const result = await transporter.sendMail(mail);
    console.log("[Email Notification] Email sent:", result.messageId);
  } catch (err) {
    console.error("[Email Notification] Failed to send email:", err);
  }
};

module.exports = {
  sendEmailNotification
};