import mongoose from 'mongoose'
const {Schema,model}=mongoose;
const paymentSchema=new Schema({
    creator:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    supporter:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    message:String,
    transactionId:{type:String,unique:true,required:true,index:true},
    amount:{type:Number,required:true},
    status:{type:String,enum:['pending','completed','failed'],default:'pending'},
    
    errorMessage:String,
    date:{type:Date,default:Date.now}
});
paymentSchema.index({creator: 1, supporter: 1 });
export default mongoose.models.Payment || model('Payment',paymentSchema);
