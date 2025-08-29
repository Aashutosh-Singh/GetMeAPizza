import mongoose from 'mongoose'
const {Schema,model}=mongoose;
const razorpaySchema=new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,unique:true,index:true},
    encryptedKeyId: { type: String, required: true },
    encryptedSecret: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }

});

export default mongoose.models.Razorpaydetail || model('Razorpaydetail',razorpaySchema);