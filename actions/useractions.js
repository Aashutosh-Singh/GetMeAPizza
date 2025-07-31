"use server";
import Razorpay from "razorpay";
import Payment from "@/models/payment";
import user from "@/models/user";
export default async function initiate(amount, to_user, paymentform) {
  await mongoose.connect(process.env.MONGO_URI);
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
   let options={
    amount:Number.parseInt(amount)*100,
    currency:"INR",
   }
  let x=await instance.orders.create(options);
  await Payment.create({
    creator: paymentform.creator,
    supporter: to_user,
    message: paymentform.message,
    transactionId: x.id,
    amount: Number.parseInt(amount),
  })
  return x;
}
