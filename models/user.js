import mongoose from 'mongoose'
import { Rock_3D } from 'next/font/google';
const{Schema,model}=mongoose;
const userSchema=new Schema({
    email:{type:String, required:true,unique:true,index:true},
    handle:{type:String,unique:true, minLength:3,sparse:true,lowercase:true,trim:true,maxLength:50},
    name:{type:String,maxLength:25, minLength:3,trim:true},
    password:{type:String},
    googleId:{type:String,unique:true,sparse:true},
    githubId:{type:String,unique:true,sparse:true},
    authProvider:{
        type:String,
        enum:['local','google'],
        required:true
    },
    profilePic:String,
    coverPic:String,
    tagline:{type:String,maxLength:100},
    
    createdAt:{type:Date,default:Date.now}
});
export default mongoose.models.User || model('User',userSchema);