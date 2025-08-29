'use server'

import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/payment";
import User from "@/models/user";
import RazorpayKeys from "@/models/razorpay";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectDB();

    // Razorpay checkout.js success callback sends form-data
    let body = await req.formData();
    body = Object.fromEntries(body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required Razorpay fields" }, { status: 400 });
    }

    // ✅ Find payment record
    const payment = await Payment.findOne({ transactionId: razorpay_order_id });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // ✅ Fetch creator’s Razorpay secret
    const razorpayKeys = await RazorpayKeys.findOne({ user: payment.creator });
    if (!razorpayKeys) {
      return NextResponse.json({ error: "Creator Razorpay credentials not found" }, { status: 500 });
    }

    const algorithm = "aes-256-ctr";
    const secretKey = Buffer.from(process.env.RAZORPAY_ENCRYPTION_KEY, "hex");
    function decrypt(hash) {
      const [ivHex, encryptedHex] = hash.split(":");
      const iv = Buffer.from(ivHex, "hex");
      const encryptedText = Buffer.from(encryptedHex, "hex");
      const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
      const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
      return decrypted.toString();
    }

    const keySecret = decrypt(razorpayKeys.encryptedSecret);

    // ✅ Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // ✅ Mark payment as completed
      const updatedPayment = await Payment.findOneAndUpdate(
        { transactionId: razorpay_order_id },
        { 
          status: "completed", 
          errorMessage: null, 
          razorpayPaymentId: razorpay_payment_id, 
          verified: true 
        },
        { new: true }
      );

      // ✅ Redirect to creator profile
      const user = await User.findById(updatedPayment.creator);
      if (!user?.handle) {
        return NextResponse.json({ error: "User handle not found" }, { status: 404 });
      }

      return NextResponse.redirect(
        new URL(`/${user.handle}`, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
        303
      );
    } else {
      // ❌ Mark failed
      await Payment.updateOne(
        { transactionId: razorpay_order_id },
        { status: "failed", errorMessage: "Payment verification failed" }
      );
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }
  } catch (err) {
    console.error("❌ Error in payment verification:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
