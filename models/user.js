import mongoose from 'mongoose'
const{Schema,model}=mongoose;
const userSchema=new Schema({
    email:{type:String, required:true,unique:true,index:true},
    handle:{type:String,unique:true,sparse:true},
    name:String,
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
    tagline:String,
    
    createdAt:{type:Date,default:Date.now}
});
export default mongoose.models.User || model('User',userSchema);