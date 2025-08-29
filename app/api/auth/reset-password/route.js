import {connectDB} from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
export async function POST(req) {
  const { handle, otp, password } = await req.json();

  try {
    await connectDB();

    // Find user by handle
    const user = await User.findOne({ handle: handle });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify OTP (you need to implement this)
    // console.log("user.verificationCode: ", user.verificationCode);
    // console.log("otp: ", otp);
    if (user.verificationCode !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Check if OTP is expired
    if (Date.now() > user.verificationExpires) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // Update password
    user.password = password;
    user.verificationCode = null; // Clear OTP
    user.verificationExpires = null; // Clear OTP expiration
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}