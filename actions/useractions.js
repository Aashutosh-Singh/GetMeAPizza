"use server";

import Razorpay from "razorpay";
import Payment from "@/models/payment";
import RazorpayKeys from "@/models/razorpay";
import { connectDB } from "@/lib/mongodb";
import crypto from "crypto";

// AES decryption setup
const algorithm = "aes-256-ctr";
const secretKey = Buffer.from(process.env.RAZORPAY_ENCRYPTION_KEY, "hex"); // must be 32 bytes

function decrypt(hash) {
  try {
    if (!hash || typeof hash !== "string") {
      throw new Error("Invalid encrypted data");
    }

    const [ivHex, encryptedHex] = hash.split(":");
    if (!ivHex || !encryptedHex) {
      throw new Error("Malformed encrypted string");
    }

    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decrypted.toString();
  } catch (err) {
    console.error("❌ Decryption failed:", err.message);
    throw new Error("Failed to decrypt Razorpay credentials");
  }
}

export default async function initiate(amount, paymentform) {
  try {
    await connectDB();

    // ✅ Validate inputs
    if (!paymentform?.creator || !paymentform?.supporter) {
      throw new Error("Creator and supporter must be provided");
    }

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    // ✅ Fetch creator’s Razorpay keys
    const razorpayKeys = await RazorpayKeys.findOne({ user: paymentform.creator });
    if (!razorpayKeys) {
      throw new Error("Creator has not set up Razorpay credentials");
    }

    // ✅ Decrypt keys
    const keyId = decrypt(razorpayKeys.encryptedKeyId);
    const keySecret = decrypt(razorpayKeys.encryptedSecret);

    if (!keyId || !keySecret) {
      throw new Error("Invalid Razorpay credentials");
    }

    // ✅ Create Razorpay instance
    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // ✅ Create order
    const order = await instance.orders.create({
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      payment_capture: 1, // auto-capture enabled
    });

    if (!order?.id) {
      throw new Error("Failed to create Razorpay order");
    }
    order.keyId = keyId; // attach keyId for frontend use
    // ✅ Save payment record in DB
    await Payment.create({
      creator: paymentform.creator,
      supporter: paymentform.supporter,
      message: paymentform.message?.trim() || "",
      transactionId: order.id,
      amount: Math.round(amount),
    });

    return order;
  } catch (err) {
    console.error("❌ Payment initiation failed:", err.message);
    throw new Error(err.message || "Unexpected error during payment initiation");
  }
}
