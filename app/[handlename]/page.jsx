"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/components/loader";
import { useEffect, useState } from "react";
import Paymentpage from "@/components/paymentPage";
import Link from "next/link";

export default function CreatorPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { handlename } = useParams();

  const [handle, setHandle] = useState(handlename || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supporters, setSupporters] = useState([]);

  // Fetch user profile when handlename changes
  useEffect(() => {
    let mounted = true;
    const ctrl = new AbortController();

    if (!handlename) {
      setHandle("");
      setUser(null);
      setLoading(false);
      return () => {
        mounted = false;
        ctrl.abort();
      };
    }

    setHandle(handlename);
    setLoading(true);

    (async () => {
      try {
        const res = await axios.get("/api/getUserProfile", {
          params: { handle: handlename },
          signal: ctrl.signal,
        });

        if (!mounted) return;

        if (res.status === 200 && res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        // ignore cancellation errors
        if (error?.code === "ERR_CANCELED") {
          // request aborted
        } else {
          console.error("Error fetching user profile:", error);
          if (mounted) setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [handlename]);

  // Fetch supporters when user is available
  useEffect(() => {
    if (!user?._id) {
      setSupporters([]);
      return;
    }

    let mounted = true;
    const ctrl = new AbortController();

    (async () => {
      try {
        const res = await axios.get("/api/getSupporters", {
          params: { userId: user._id },
          signal: ctrl.signal,
        });
        if (!mounted) return;

        if (res.data?.supporters) setSupporters(res.data.supporters);
        else setSupporters([]);
      } catch (error) {
        if (error?.code === "ERR_CANCELED") {
          // aborted
        } else {
          console.error("Error fetching supporters:", error);
          if (mounted) setSupporters([]);
        }
      }
    })();

    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [user]);

  // If logged-in user visits their own creator page, redirect to /profile
  useEffect(() => {
    if (status === "loading") return; // wait for session
    if (!user || !session) return;

    try {
      if (user.handle === session.user.handle) {
        console.log("Redirecting to /profile");
        // use replace so back button won't return to the creator URL
        router.replace("/profile");
      }
    } catch (err) {
      console.error("redirect error:", err);
    }
  }, [user, session, status, router]);

  // Loading states
  if (loading || status === "loading") {
    return (
      <div className="w-screen h-screen flex justify-center mt-20">
        <Loading />
      </div>
    );
  }

  // User not found
  if (!user) {
    console.log("User not found");
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="text-2xl font-bold text-gray-700">User not found</div>
      </div>
    );
  }

  // Main render (user exists)
  return (
    <div>
      <div className="Coverpage relative">
        <div className="Coverimage w-full aspect-[4/1] sm:aspect-[5/2] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden">
          <img
            src={user.coverPic || "/model.jpg"}
            alt="Cover Image"
            className="object-cover w-full h-full aspect-video"
          />
        </div>
        <div className="w-full flex justify-center">
          <img
            src={user.profilePic || "/profilepic.jpg"}
            alt="profile image"
            className="rounded-full w-20 h-20 -bottom-10 md:w-30 md:h-30 absolute border-4 border-white md:-bottom-15 object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-15 items-center justify-center">
        <div className="font-bold text-4xl">{user.name || "Unnamed"}</div>
        <div className="text-gray-800 text-lg">{user.tagline || ""}</div>
      </div>

      <div className="flex flex-col md:flex-row md:gap-5 gap-15 w-screen p-10">
        <div className="supporters border-1 border-gray-600 md:w-[48%] h-100 bg-gray-900/10 backdrop-blur-md shadow-lg shadow-gray-700 rounded-xl">
          <div className="p-4">
            <div className="font-bold text-2xl">Supporters</div>
            <ul className="divide-y divide-gray-600 gap-1 px-2 mt-4 h-77 overflow-y-auto">
              {supporters.length === 0 ? (
                <li className="h-full w-full text-center">No supporters found</li>
              ) : (
                supporters.map((supporter) => {
                  const sup = supporter.supporter || {};
                  return (
                    <li key={supporter._id || sup._id || Math.random()} className="py-5 p-2">
                      <Link href={`/${sup.handle || ""}`} className="flex gap-2 items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <img src={sup.profilePic || "/profilepic.jpg"} alt="supporter profile" className="w-10 h-10 rounded-full object-cover" />
                          <div className="flex flex-col">
                            <div className="font-bold">{sup.name || sup.handle || "Unknown"}</div>
                            <div><i>{sup.handle}</i></div>
                          </div>
                        </div>
                        <span className="font-bold">₹{supporter.amount || 0}</span>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>

        <div className="payment md:w-[48%] min-h-100 bg-gray-900/10 backdrop-blur-md shadow-lg shadow-gray-700 rounded-xl border-1 border-gray-600">
          <Paymentpage />
        </div>
      </div>
    </div>
  );
}
