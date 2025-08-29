// /app/api/following/route.js
import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import FollowRelation from "@/models/followRelation";
import User from "@/models/user";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const handle = searchParams.get("handle");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    await connectDB();

    const targetUser = await User.findOne({ handle });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // find following
    const following = await FollowRelation.find({ follower: targetUser._id })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("following", "name handle profilePic");

    const formatted = following.map((f) => ({
      username: f.following.handle,
      name: f.following.name,
      avatar: f.following.profilePic,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("Following API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
