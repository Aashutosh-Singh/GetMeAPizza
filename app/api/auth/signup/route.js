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

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your email — your OTP",
    text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
  });

  return info;
}

export async function POST(req) {
  try {
    
    await connectDB();
    const { email, password, handle, name } = await req.json();
    

    if (!email || !password || !handle || !name || handle.length < 3 || password.length < 6) {
      return NextResponse.json({ error: "Missing fields or invalid entry" }, { status: 400 });
    }

    // check handle/email uniqueness (regardless of verified)
    const existingByEmail = await User.findOne({ email });
    
    if (existingByEmail && existingByEmail.verified) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const existingByHandle = await User.findOne({ handle });
    if (existingByHandle && existingByHandle.verified) {
      return NextResponse.json({ error: "Handle already in use" }, { status: 400 });
    }
    
    const otp = genOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000);


    if (existingByEmail && !existingByEmail.verified) {
      // update existing unverified record (safe)
      existingByEmail.password = password;
      existingByEmail.handle = handle;
      existingByEmail.name = name;
      existingByEmail.verificationCode = otp;
      existingByEmail.verificationExpires = expires;
      await existingByEmail.save();
      
      await sendOtpEmail(email, otp);
      
      return NextResponse.json({ message: "Verification code sent (existing record)" }, { status: 200 });
    }

    // create new
    const newUser = new User({
      email,
      password,
      handle,
      name,
      authProvider: "local",
      verified: false,
      verificationCode: otp,
      verificationExpires: expires,
    });

    await newUser.save();
    
    await sendOtpEmail(email, otp);
    

    return NextResponse.json({ message: "User created, verification code sent" }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
