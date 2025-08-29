// /app/api/followers/route.js
import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import FollowRelation from "@/models/followRelation";
import User from "@/models/user";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const handle = searchParams.get("handle"); // username/handle of profile
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10; // you can increase if you want

    await connectDB();

    // find the target user
    const targetUser = await User.findOne({ handle });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // find followers
    const followers = await FollowRelation.find({ following: targetUser._id })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("follower", "name handle profilePic");

    const formatted = followers.map((f) => ({
      username: f.follower.handle,
      name: f.follower.name,
      avatar: f.follower.profilePic,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("Followers API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
