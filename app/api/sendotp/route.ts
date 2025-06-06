import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Hisaab Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #111; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #e67e22;">🔐 Email Verification</h2>
    <p>Hello,</p>
    <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
    <div style="font-size: 24px; font-weight: bold; color: #2ecc71; margin: 20px 0;">${otp}</div>
    <p>This code will expire in 10 minutes. Do not share it with anyone.</p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #666;">If you did not request this, you can safely ignore this email.</p>
  </div>
`,

  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ success: false, error: "Email send failed" }, { status: 500 });
  }
}
