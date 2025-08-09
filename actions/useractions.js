"use server";
import Razorpay from "razorpay";
import Payment from "@/models/payment";
import mongoose from 'mongoose';
export default async function initiate(amount, paymentform) {
  if(mongoose.connection.readyState!==1){
    await mongoose.connect(process.env.MONGO_URI);
  }
  if (!paymentform.creator || !paymentform.supporter) {
    throw new Error("Creator and supporter must be set in payment form");
  }
  if(amount<=0 ||!amount || isNaN(amount)){
    throw new Error("Invalid amount");
  }
  var instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
   let options={
    amount:amount*100,
    currency:"INR",
   }
  let x=await instance.orders.create(options);
  await Payment.create({
    creator: paymentform.creator,
    supporter: paymentform.supporter,
    message: paymentform.message,
    transactionId: x.id,
    amount: Number.parseInt(amount),
  })
  return x;
}
