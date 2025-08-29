import Payment from '@/models/payment';
import {NextResponse} from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
export async function GET(req){
    
    const userId = req.nextUrl.searchParams.get("userId");
    
    if(!userId){
        return NextResponse.json({error:"User ID is required"}, {status:400});
    }
    await connectDB();
    try {
        const supporters = await Payment.find({ creator: userId, status: 'completed' })
            .populate('supporter', 'name handle profilePic')
            .select('amount createdAt')
            .sort({ amount: -1 });
    
        if (!supporters || supporters.length === 0) {
            return NextResponse.json({ supporters: [] }, { status: 200 });
        }
        
        return NextResponse.json({ supporters }, { status: 200 });
    } catch (error) {
        console.error("Error fetching supporters:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}