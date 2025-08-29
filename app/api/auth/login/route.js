import { NextResponse } from "next/server";

import mongoose from "mongoose";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await User.findOne({ email, authProvider: "local" });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!user.verified) {
      return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 403 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    return NextResponse.json({ success: true, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
