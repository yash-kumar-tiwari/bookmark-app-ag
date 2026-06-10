import nodemailer from "nodemailer";

let transporter = null;

/**
 * Get the singleton Nodemailer transporter.
 */
export function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP configuration is incomplete. Mailer not initialized.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: false, // TLS
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}
