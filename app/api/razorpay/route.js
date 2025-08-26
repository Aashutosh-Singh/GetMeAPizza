'use server'
import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/payment";
import User from "@/models/user";
import mongoose from 'mongoose';

const crypto = await import('crypto');

async function POST(req) {
    await connectDB();
    let body = await req.formData();
    body = Object.fromEntries(body);
    let p = await Payment.findOne({ transactionId: body.razorpay_order_id });
    if (!p) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json({ error: "Razorpay key secret not set" }, { status: 500 });
    }
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.razorpay_order_id + "|" + body.razorpay_payment_id)
        .digest('hex');
    let isValid = generatedSignature === body.razorpay_signature;

    if (isValid) {
        console.log("Payment verified successfully");
        let updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: body.razorpay_order_id },
            { status: 'completed', errorMessage: null },
            { new: true }
        );
        console.log("Updated Payment:", updatedPayment,"creator:", updatedPayment.creator);
        let user = await User.findOne({ _id: updatedPayment.creator });
        if (!user || !user.handle) {
            return NextResponse.json({ error: "User not found or handle name not set" }, { status: 404 });
        }
        return NextResponse.redirect(new URL(`http://localhost:3000${user.handle}`,  'http://localhost:3000'), 303);
    } else {
        await Payment.updateOne({ transactionId: body.razorpay_order_id }, { status: 'failed', errorMessage: 'Payment verification failed' });
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }
}

export { POST };