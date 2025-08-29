"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push("/profile");
    }
  }, [status, session, router]);

  // 🔹 Handle Email/Password Login via NextAuth
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError(result.error);
    }

    setLoading(false);
  };

  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <section className="flex items-center justify-center min-h-screen px-6  dark:bg-gray-900/10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-2xl bg-white/10 dark:bg-gray-800/10 shadow-xl p-8"
        >
          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-black ">
              Sign In
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-700">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          {/* Google Sign In */}
          {/* <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-3 font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4c-11 0-20 9-20 20s9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.6-.4-3.9z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
              />
            </svg>
            Sign in with Google
          </motion.button> */}

          {/* Divider
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div> */}

          {/* Email/Password Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50/10 dark:bg-gray-700/10 px-4 py-2 text-gray-900  focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="name@example.com"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                maxLength={16}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-700/10 px-4 py-2 text-gray-900  focus:ring-2 focus:ring-blue-500 focus:outline-none pr-6"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 flex items-center"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg py-3 shadow hover:from-purple-700 hover:to-blue-700 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* Links */}
          <div className="flex justify-between text-sm mt-4 text-gray-600 ">
            <Link href="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
            <Link href="/signup" className="hover:underline">
              Don’t have an account? Sign up
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }
}
