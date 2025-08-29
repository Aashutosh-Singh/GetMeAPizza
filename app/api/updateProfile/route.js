import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";  // ✅ correct import
import User from "@/models/user";

export async function POST(req) {
  const session = await getServerSession(authOptions);  // ✅ now defined

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, handle, tagline, profilePic, coverPic, bio } = await req.json();
    await connectDB();

    const user = await User.findOne({ handle });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- validation + updates ---
    if (handle && (handle.length < 3 || handle.length > 25)) {
      return NextResponse.json({ error: "Handle must be between 3 and 25 characters" }, { status: 400 });
    }

    if (handle && handle !== user.handle) {
      const existingUser = await User.findOne({ handle });
      if (existingUser) {
        return NextResponse.json({ error: "Handle already exists" }, { status: 400 });
      }
      user.handle = handle;
    }

    if (name?.length >= 3 && name?.length <= 25) user.name = name;
    if (tagline?.length >= 3 && tagline?.length <= 100) user.tagline = tagline;
    if (bio?.length <= 500) user.bio = bio;

    if (profilePic) user.profilePic = profilePic;
    if (coverPic) user.coverPic = coverPic;

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
