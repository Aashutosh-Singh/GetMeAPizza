// app/verify/page.js
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyPage() {
  const search = useSearchParams();
  const router = useRouter();
  const email = search.get("email") || "";
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMsg(""); }, [code]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);
      // redirect to login page (user can now login)
      router.push("/login?verified=1");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);
      setMsg("Sent a new code to your email.");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50/50">
      <div className="w-full max-w-md bg-white/40 p-8 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Verify your email</h2>
        <p className="text-sm text-gray-600 mb-3">We sent a 6-digit code to <strong>{email}</strong></p>
        <form onSubmit={submit} className="space-y-3">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" className="w-full p-2 border rounded" />
          {msg && <div className="text-sm text-red-500">{msg}</div>}
          <div className="flex gap-3">
            <button disabled={loading} type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded">{loading ? "Verifying..." : "Verify"}</button>
            <button type="button" onClick={resend} disabled={loading} className="py-2 px-3 border rounded">Resend</button>
          </div>
        </form>
      </div>
    </div>
  );
}
