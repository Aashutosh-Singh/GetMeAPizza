import mongoose from 'mongoose'
const {Schema,model}=mongoose;
const razorpaySchema=new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,unique:true},
    encryptedKeyId: { type: String, required: true },
    encryptedSecret: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }

});
razorpaySchema.index({ user: 1 });
export default mongoose.models.Razorpay || model('Razorpay',razorpaySchema);