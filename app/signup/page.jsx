// app/signup/page.js
"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function SignupPage() {
  const { data: session } = useSession();
  // const [handle, setHandle] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validHandle, setValidHandle] = useState(false);

  const [form, setForm] = useState({
    handle: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "handle") {
      setTimeout(() => {
        console.log("Validating handle:", value.trim());
        axios
          .post("/api/auth/validateHandle", { handle: value.trim() })
          .then((res) => setValidHandle(res.data.valid))
          .catch((err) => setValidHandle(false));
      }, 250);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirmPassword)
      return setErr("Passwords do not match");
    if (!form.terms) return setErr("Accept Terms");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          handle: form.handle,
          name: form.name,
        }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || data.message || "Signup failed");

      // go to verification page and attach email in query
      router.push(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50/10 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-black/10 rounded-2xl p-8 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">Create account</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">
              Handle
              <span
                className={`px-2 ${
                  validHandle ? "text-green-500" : "text-red-500"
                } ${form.handle.length < 3 ? "hidden" : ""}`}
              >
                {validHandle ? "✓ Valid" : "✗ Not Available"}
              </span>
            </label>
            <input
              minLength={3}
              name="handle"
              value={form.handle}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div className="relative">
            <label className="text-sm font-medium">Password</label>
            <input
              maxLength={16}
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              minLength={6}
              required
              className="w-full mt-1 p-2 pr-13 border rounded"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute top-[50%] right-3"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          <div className="relative">
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              maxLength={16}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              required
              className="w-full mt-1 p-2 pr-13 border rounded"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute top-[50%] right-3"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="terms"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              type="checkbox"
            />
            <label htmlFor="terms" className="text-sm">
              I accept the{" "}
              <a className="text-blue-600" href="/terms">
                Terms & Conditions{" "}
              </a>
            </label>
          </div>

          {err && <div className="text-sm text-red-500">{err}</div>}

          <button
            disabled={loading}
            className="w-full py-3 rounded bg-gray-900 text-white  transition-all ease-in-out duration-500 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            
             
            
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
