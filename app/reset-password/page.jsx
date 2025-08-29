"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [handle, setHandle] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setHandle(params.get("handle"));
  }, []);

  const handleReset = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setLoading(true);

      const otp = e.target.otp.value.trim();
      const password = e.target.password.value;
      const confirmPassword = e.target.confirmPassword.value;

      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        setLoading(false);
        return;
      }

      try {
        console.log("handle: ", handle);
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handle, otp, password }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Something went wrong");

        setSuccess("Password reset successful! Redirecting...");
        setTimeout(() => router.push("/login"), 200);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

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
            Reset Password
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter the OTP sent to your email and set a new password.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleReset}>
          <InputField
            id="otp"
            type="text"
            label="OTP"
            placeholder="Enter the OTP"
            required
          />

          {/* Password field with toggle */}
          <PasswordField
            id="password"
            label="New Password"
            placeholder="••••••••"
            show={show}
            setShow={setShow}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            show={show}
            setShow={setShow}
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
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

/* 🔹 Normal Input Field */
function InputField({ id, type, label, placeholder, required }) {
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
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}

/* 🔹 Password Field with Toggle */
function PasswordField({ id, label, placeholder, show, setShow }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          id={id}
          name={id}
          required
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
