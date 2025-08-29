import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import User from "@/models/user"; // Assuming you have a User model
import {connectDB} from "@/lib/mongodb"; // Your DB connection function

export async function POST(req) {
  try {
    const { email } = await req.json();

    // 1. Validate email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 2. Connect to DB
    await connectDB();

    // 3. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP
    const expiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // 5. Save OTP to user (or you can use a separate OTP collection)
    user.verificationCode = otp;
    user.verificationExpires = expiresAt;
    await user.save();

    // 6. Send OTP via email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP sent successfully!", handle:user.handle }, { status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Error sending OTP" }, { status: 500 });
  }
}
