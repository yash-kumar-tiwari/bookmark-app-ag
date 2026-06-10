import { NextResponse } from "next/server";
import { getTransporter } from "@/lib/mailer";

export async function POST(request) {
  try {
    const { email, handle } = await request.json();

    if (!email || !handle) {
      return NextResponse.json(
        { success: false, message: "Missing email or handle" },
        { status: 400 }
      );
    }

    const transporter = getTransporter();
    if (!transporter) {
      console.warn("SMTP Transporter is not configured. Email not sent.");
      return NextResponse.json(
        { success: false, message: "SMTP configuration is missing or incomplete" },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const dashboardLink = `${appUrl}/dashboard`;
    const fromUser = process.env.SMTP_USER;

    const info = await transporter.sendMail({
      from: `"Bookmarks" <${fromUser}>`,
      to: email,
      subject: "Welcome to Bookmarks",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #6d28d9;">Welcome to Bookmarks!</h2>
          <p>Hello,</p>
          <p>Thank you for signing up! We're excited to have you on board.</p>
          <p>Your handle is: <strong>@${handle}</strong></p>
          <p style="margin-top: 24px;">
            <a href="${dashboardLink}" style="background-color: #6d28d9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Go to Dashboard
            </a>
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 32px; margin-bottom: 16px;" />
          <p style="font-size: 12px; color: #666;">If you did not sign up for this account, you can ignore this email.</p>
        </div>
      `,
    });

    console.log("Email sent successfully via Nodemailer, messageId:", info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending welcome email via Nodemailer:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
