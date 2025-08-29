import mongoose from 'mongoose';
import {NextResponse} from 'next/server';
import User from '@/models/user';
import { connectDB } from '@/lib/mongodb';
export async function POST(req){
    await connectDB();
    const {handle}=await req.json();
    if(!handle){
        return NextResponse.json({error:"Handle is required"},{status:400});
    }
    const user=await User.findOne({handle});
    if(!user){
        return NextResponse.json({valid:true},{status:200});

    }
    return NextResponse.json({valid:false},{status:200});
}