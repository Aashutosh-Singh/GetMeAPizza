import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").toLowerCase().trim();

  if (!email) return NextResponse.json({ valid: false }, { status: 400 });

  const exists = await User.findOne({ email });
  return NextResponse.json({ valid: !Boolean(exists) });
}
