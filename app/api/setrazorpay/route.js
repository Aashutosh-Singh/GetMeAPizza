// app/api/setrazorpay/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "@/lib/mongodb";
import Razorpay from "@/models/razorpay";
import crypto from "crypto";

const algorithm = "aes-256-ctr";
const secretKey = Buffer.from(process.env.RAZORPAY_ENCRYPTION_KEY, "hex"); // must be 32 bytes

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

function decrypt(hash) {
  const [ivHex, encryptedHex] = hash.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString();
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { rpzid, rpzkey } = await req.json();
    if (!rpzid || !rpzkey) {
      return new Response(JSON.stringify({ error: "Both Razorpay Id and Key are required" }), { status: 400 });
    }

    await dbConnect();

    const encryptedKeyId = encrypt(rpzid);
    const encryptedSecret = encrypt(rpzkey);

    const data = await Razorpay.findOneAndUpdate(
      { user: session.user.id },
      { encryptedKeyId, encryptedSecret },
      { upsert: true, new: true }
    );

    return new Response(
      JSON.stringify({ message: "Razorpay credentials saved successfully", id: data._id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error saving Razorpay creds:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();
    const data = await Razorpay.findOne({ user: session.user.id });

    if (!data) {
      return new Response(JSON.stringify({ error: "No Razorpay details found" }), { status: 404 });
    }

    // don’t return decrypted values → too sensitive
    return new Response(
      JSON.stringify({
        razorpay: {
          id: data._id,
          hasCredentials: !!data.encryptedKeyId, // boolean flag
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching Razorpay creds:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

// 🔓 When you need real keys internally, use `decrypt(data.encryptedSecret)`
