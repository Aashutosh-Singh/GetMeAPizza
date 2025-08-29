"use client";
import initiate from "@/actions/useractions";
import Script from "next/script";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Paymentpage({ user }) {
  
  const { data: session } = useSession();
  const [amount, setAmount] = useState("");
  const [paymentform, setPaymentform] = useState({
    creator: null,
    supporter: null,
    message: "",
  });

  // Keep paymentform synced with props + session
  useEffect(() => {
    if (session) {
      setPaymentform((prev) => ({
        ...prev,
        supporter: session.user.id,
      }));
    }
  }, [session]);

  useEffect(() => {
    if (user) {
      setPaymentform((prev) => ({
        ...prev,
        creator: user._id,
      }));
    }
  }, [user]);

  // handle inputs
  const handleAmountChange = (e) => {
    e.preventDefault();
    let value = e.target.value.trim().replace(/[^0-9]/g, "");
    setAmount(Number(value));
  };

  const handleMessageChange = (e) => {
    e.preventDefault();
    setPaymentform((prev) => ({ ...prev, message: e.target.value.trimStart(" ") }));
  };

  // Main pay function
  async function pay(amount, paymentform) {
    try {
      if (!session) {
        alert("You must be logged in to make a payment");
        return;
      }

      paymentform.creator = user._id;
      paymentform.supporter = session.user.id;

      // call server action
      const order = await initiate(amount, paymentform);
      
      if (!order || !order.id || !order.keyId) {
        throw new Error("Failed to initiate payment");
      }

      const options = {
        key: order.keyId, // ✅ comes from backend, creator-specific
        amount: order.amount,
        currency: "INR",
        name: "Buy me a Pizza",
        description: "Support your creator ❤️",
        image: "/pizza.png",
        order_id: order.id,
        callback_url: "/api/razorpay", // your webhook/verify API
        prefill: {
          name: session.user.name,
          email: session.user.email,
        },
        notes: {
          creator: user._id,
          supporter: session.user.id,
        },
        theme: { color: "#3399cc" },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("Razorpay SDK not loaded");
      }
    } catch (err) {
      console.error("❌ Payment failed:", err);
      alert(err.message || "Something went wrong while starting payment");
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="p-4">
        <div>
          <div className="font-bold mb-4">Make a payment</div>
          <div className="flex gap-2 flex-col">
            <input
              onChange={handleAmountChange}
              value={amount}
              type="text"
              inputMode="numeric"
              minLength={1}
              maxLength={5}
              name="amount"
              placeholder="Enter Amount"
              className="rounded-lg bg-gray-900/10 border-1 border-gray-600 p-2 w-full"
            />

            <textarea
              name="message"
              onChange={handleMessageChange}
              value={paymentform.message}
              minLength={2}
              maxLength={300}
              id="message"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-900/10 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900/10 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your thoughts here..."
            ></textarea>

            <button
              disabled={!session || !user.hasRazorpay || !amount || parseInt(amount) < 1}
              onClick={() => pay(amount, paymentform)}
              className="overflow-hidden relative w-full p-2 h-10 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer z-10 group "
            >
              Pay
              <span className="absolute w-full h-32 -top-8 -left-2 bg-blue-200 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-bottom" />
              <span className="absolute w-full h-32 -top-8 -left-2 bg-blue-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-bottom" />
              <span className="absolute w-full h-32 -top-8 -left-2 bg-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-bottom" />
              <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-1.5 left-[40%] z-10">
                Thanks
              </span>
            </button>
          </div>

          {/* Quick payment shortcuts */}
          <div className="w-full mt-2">
            <div className="flex h-full justify-center items-center">
              <div className=" text-white flex gap-y-1 min-h-15 gap-x-2 rounded-xl bg-gray-900/30 px-4 py-1 items-center w-full justify-evenly flex-wrap lg:flex-nowrap">
                {[100, 200, 500, 1000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    disabled={!session || !user.hasRazorpay}
                    onClick={() => {
                      setAmount(Number(amt));
                      pay(amt, paymentform);
                    }}
                    className="px-2 transition-all duration-300 hover:scale-125 flex h-8 items-center justify-center rounded-md border border-[#3490f340] bg-gray-900 text-gray-200 shadow-[0px_1px_4px] hover:shadow-[0px_4px_10px] shadow-gray-700"
                  >
                    <span className="font-medium text-md">₹{amt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {!user.hasRazorpay && (<div className="text-red-500">You can't pay to this user. User has not configured Razorpay.</div>)}
        </div>
      </div>
    </>
  );
}
