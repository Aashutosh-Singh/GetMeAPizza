"use server";

import Razorpay from "razorpay";
import Payment from "@/models/payment";
import Razorpaydetail from "@/models/razorpay";
import { connectDB } from "@/lib/mongodb";
import crypto from "crypto";

/**
 * AES-256-CTR decryption.
 * Expecting `hash` format: "<ivHex>:<encryptedHex>"
 * Environment var RAZORPAY_ENCRYPTION_KEY must be a 64-char hex string (32 bytes)
 */
const ALGORITHM = "aes-256-ctr";
const ENC_KEY_HEX = process.env.RAZORPAY_ENCRYPTION_KEY || "";

function getSecretKey() {
  if (!ENC_KEY_HEX) throw new Error("Encryption key missing");
  const buf = Buffer.from(ENC_KEY_HEX, "hex");
  if (buf.length !== 32) {
    throw new Error("Invalid encryption key length; expected 32 bytes (64 hex chars)");
  }
  return buf;
}

function decrypt(hash) {
  try {
    if (!hash || typeof hash !== "string") {
      throw new Error("Invalid encrypted value");
    }

    const parts = hash.split(":");
    if (parts.length !== 2) {
      throw new Error("Malformed encrypted string");
    }

    const [ivHex, encryptedHex] = parts;
    if (!ivHex || !encryptedHex) throw new Error("Malformed encrypted string");

    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    const secretKey = getSecretKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decrypted.toString("utf8");
  } catch (err) {
    // Log full internal error for debugging (do NOT send this to client)
    console.error("❌ Decryption failed:", err);
    // Throw generic error to caller
    throw new Error("Failed to decrypt credentials");
  }
}

/**
 * initiate(amount, paymentform)
 * - amount: number (rupees)
 * - paymentform: { creator: STRING, supporter: STRING, message?: STRING }
 *
 * Returns safe order info for frontend: { orderId, amountInPaise, currency, keyId }
 */
export default async function initiate(amount, paymentform) {
  try {
    // Connect DB
    await connectDB();

    // Basic validations
    if (!paymentform || !paymentform.creator || !paymentform.supporter) {
      throw new Error("Creator and supporter are required");
    }
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    // Fetch razorpay credentials for creator
    const razorpayKeys = await Razorpaydetail.findOne({ user: paymentform.creator });
    if (!razorpayKeys) {
      throw new Error("Creator has not configured Razorpay");
    }

    // Decrypt credentials
    const keyId = decrypt(razorpayKeys.encryptedKeyId);
    const keySecret = decrypt(razorpayKeys.encryptedSecret);
    
    

    if (!keyId || !keySecret) {
      throw new Error("Invalid Razorpay credentials");
    }

    // Create instance
    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // Prepare amount in paise (Razorpay expects smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Create order on Razorpay
    
    const order = await instance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      payment_capture: 1, // auto-capture
      notes: {
        creator: String(paymentform.creator),
        supporter: String(paymentform.supporter),
      },
    });

    if (!order || !order.id) {
      throw new Error("Failed to create Razorpay order");
    }

    // Save a pending payment record (don't mark as success until webhook confirms)
    await Payment.create({
      creator: paymentform.creator,
      supporter: paymentform.supporter,
      message: paymentform.message?.trim() || "",
      transactionId: order.id,
      amount: Math.round(amount), // keep rupees for convenience if you used this before
      amountInPaise,
      currency: order.currency || "INR",
      status: "pending",
      createdAt: new Date(),
    });
    
    // Only return safe details to frontend (never send key_secret)
    
    return {
      id: order.id,
      amountInPaise,
      currency: order.currency || "INR",
      keyId,
    };
  } catch (err) {
    // Log full error server-side for debugging
    console.error("❌ Payment initiation failed:", err);
    // Throw a generic message to caller so internals are not leaked
    throw new Error("Could not initiate payment. Please try again later.");
  }
}
