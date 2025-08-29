
import User from "@/models/user";
import {NextResponse} from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from "@/lib/mongodb";
import Razorpaydetail from "@/models/razorpay";
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
        await connectDB();
        const user = await User.findOne(
            { handle: userhandle },
            { _id:1, name: 1,  handle: 1, tagline: 1, profilePic: 1, coverPic: 1 ,bio:1} // specify only needed fields
        );
        if(!user){
            return NextResponse.json({error:"User not found"}, {status:404});
        }

        // Check if user has a Razorpay account
        
        const hasRazorpay = !!(await Razorpaydetail.exists({ user: user._id }));

        

        // Sanitize user object to exclude sensitive fields
        
        const { _id, handle, name, tagline, profilePic, coverPic,bio } = user;
        return NextResponse.json({ user: { _id, handle, name, tagline, profilePic, coverPic,bio , hasRazorpay } }, { status:200 });
    }
    
}

