// app/about/page.jsx

"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AboutPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen   flex flex-col items-center py-16 px-6">
      
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center text-gray-800"
      >
        About <span className="text-orange-500">Buy Me a Pizza</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-4 max-w-2xl text-center text-gray-600 text-lg"
      >
        A simple, fun, and genuine way to support people you care about.  
        Whether you’re an artist, a developer, or just someone with a dream,  
        Buy Me a Pizza helps you receive support in the easiest way possible 🍕.
      </motion.p>

      {/* Mission Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 w-full max-w-3xl"
      >
        <div className="rounded-2xl bg-white shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            We believe support should feel as easy as sharing a pizza with a friend.  
            No complicated setups, no stress — just a friendly way to give and receive.  
            Whether it’s helping creators chase their goals or simply sending love,  
            every slice counts.
          </p>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-12 flex flex-col md:flex-row gap-6"
      >
        <Link href={session ? "/profile" : "/api/auth/signin"}>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 shadow-md transition">
            Support Someone 🍕
          </button>
        </Link>
        
      </motion.div>
    </div>
  );
}
