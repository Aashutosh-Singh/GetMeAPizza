import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req) {
  try {
    await connectDB();
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.verified) return NextResponse.json({ message: "Already verified" }, { status: 200 });

    if (!user.verificationCode || !user.verificationExpires) {
      return NextResponse.json({ error: "No verification pending" }, { status: 400 });
    }

    if (user.verificationExpires < new Date()) {
      return NextResponse.json({ error: "Verification code expired" }, { status: 400 });
    }
      
    if (user.verificationCode !== code.toString()) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    user.verified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
