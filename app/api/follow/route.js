import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import {connectDB} from "@/lib/mongodb";
import FollowRelation from "@/models/followRelation";
import User from "@/models/user";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const { targetUserId } = await req.json();
    await connectDB();

    const me = await User.findOne({ email: session.user.email });
    if (!me) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    if (me._id.toString() === targetUserId) {
      return new Response(JSON.stringify({ error: "Cannot follow yourself" }), { status: 400 });
    }

    // check if already following
    const existing = await FollowRelation.findOne({
      follower: me._id,
      following: targetUserId,
    });

    if (existing) {
      // unfollow
      await FollowRelation.deleteOne({ _id: existing._id });
      return new Response(JSON.stringify({ status: "unfollowed" }), { status: 200 });
    } else {
      // follow
      await FollowRelation.create({
        follower: me._id,
        following: targetUserId,
      });
      return new Response(JSON.stringify({ status: "followed" }), { status: 200 });
    }
  } catch (error) {
    console.error("Follow API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // profile user (the one we’re visiting)

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
    }

    await connectDB();

    // profile user
    const profileUser = await User.findById(userId);
    if (!profileUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // logged-in user (me)
    const me = await User.findOne({ email: session.user.email });
    if (!me) {
      return new Response(JSON.stringify({ error: "Logged-in user not found" }), { status: 404 });
    }

    // count followers & following for profileUser
    const followers = await FollowRelation.countDocuments({ following: profileUser._id });
    const following = await FollowRelation.countDocuments({ follower: profileUser._id });

    // check if I follow profileUser
    const relation = await FollowRelation.findOne({
      follower: me._id,
      following: profileUser._id,
    });
    
    return new Response(
      JSON.stringify({
        followers,
        following,
        isFollowing: !!relation,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Follow Count Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
