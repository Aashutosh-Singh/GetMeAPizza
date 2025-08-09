import mongoose from "mongoose";
import { NextResponse } from "next/server";
import User from "@/models/user";
export async function POST(req) {
   
  try {
    const { name,email, handle, tagline, profilePic, coverPic } = await req.json();
    
    if ((handle.length < 3 && handle.length!==0) || handle.length > 20  ) {
      return NextResponse.json({ error: "Handle must be between 3 and 20 characters" }, { status: 400 });
    }
    
    if(mongoose.connection.readyState!==1){
        await mongoose.connect(process.env.MONGODB_URI);
    }
    const user=await User.findOne({ email: email });
    
    if(user.handle===handle){
      if(name.length>3 && name.length<50){
        user.name=name;
      }
      user.name=name;
      user.profilePic=profilePic;
      user.coverPic=coverPic;
      if(tagline.length>3 && tagline.length<100 ){
        user.tagline=tagline;
      }
      
      await user.save();
      return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
    }
    else{
      const existinguser=await User.find({handle:handle});
      if(existinguser){console.log(existinguser);}
      if(existinguser.length>0){

        return NextResponse.json({ error: "Handle already exists" }, { status: 400 });
      }
      else{
        if(name.length>3 && name.length<50){
          user.name=name;
        }
        user.handle=handle;
        user.profilePic=profilePic;
        user.coverPic=coverPic;
        if(tagline.length>3 && tagline.length<100 ){
        user.tagline=tagline;
      }
        await user.save();
        return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
      }
    }
    
   
    if (!user) {
        console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
