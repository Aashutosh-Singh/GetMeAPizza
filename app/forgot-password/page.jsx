"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {useRouter} from "next/navigation"

export default function RequestOtp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Request OTP Handler
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      
      setSuccess("OTP sent to your email. Please check your inbox.");
      setTimeout(() => router.push(`/reset-password?handle=${data.handle}`), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-6 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-8"
      >
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Request OTP
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your email to receive an OTP for password reset.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleRequestOtp}>
          <InputField
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg py-3 shadow hover:from-purple-700 hover:to-blue-700 transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

/* 🔹 Reusable Input Component */
function InputField({ id, type, label, placeholder, required, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
