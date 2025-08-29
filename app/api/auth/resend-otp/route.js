import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import nodemailer from "nodemailer";

function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your verification OTP",
    text: `Your verification code is: ${otp}`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
  });
}

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.verified) return NextResponse.json({ message: "Already verified" }, { status: 200 });

    // simple throttle: if last OTP not expired, avoid spamming
    if (user.verificationExpires && user.verificationExpires > new Date(Date.now() - 2 * 60 * 1000)) {
      // if previous OTP was generated less than 2 minutes ago, deny to avoid spam
      return NextResponse.json({ error: "Please wait before requesting another code" }, { status: 429 });
    }

    const otp = genOtp();
    user.verificationCode = otp;
    user.verificationExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);
    return NextResponse.json({ message: "Verification code resent" }, { status: 200 });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
