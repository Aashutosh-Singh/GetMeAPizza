
import User from "@/models/user";
import {NextResponse} from 'next/server';
import mongoose from 'mongoose';
/**
 * Handles GET requests to fetch a user profile by handle.
 * @param {Object} req - The request object containing nextUrl with searchParams.
 * @returns {NextResponse} JSON response with user data or error message.
 */
export async function GET(req){
    const userhandle = req.nextUrl.searchParams.get("handle");
    
    if(!userhandle){
        return NextResponse.json({error:"Handle is required"}, {status:400});
    }
    else{
        // Ensure mongoose is connected only once using a utility
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
        const user = await User.findOne(
            { handle: userhandle },
            { _id:1, name: 1,  handle: 1, tagline: 1, profilePic: 1, coverPic: 1 } // specify only needed fields
        );
        if(!user){
            return NextResponse.json({error:"User not found"}, {status:404});
        }
        // Sanitize user object to exclude sensitive fields
        const { _id, handle, name, tagline, profilePic, coverPic } = user;
        return NextResponse.json({ user: { _id, handle, name, tagline, profilePic, coverPic } }, { status:200 });
    }
    
}

