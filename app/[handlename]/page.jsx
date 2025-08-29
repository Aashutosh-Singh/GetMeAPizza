"use client";
import FollowersFollowingModal from "@/components/FollowersFollowingModal";
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
  const [modal, setModal] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supporters, setSupporters] = useState([]);

  // follow state: null = unknown (loading), true = following, false = not following
  const [isFollowing, setIsFollowing] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [hasRazorpay, setHasRazorpay] = useState(false);
  // 🔹 Fetch profile
  useEffect(() => {
    let mounted = true;
    const ctrl = new AbortController();

    if (!handlename) {
      setUser(null);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await axios.get("/api/getUserProfile", {
          params: { handle: handlename },
          signal: ctrl.signal,
          withCredentials: true,
        });

        if (!mounted) return;

        if (res.status === 200 && res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (err?.code !== "ERR_CANCELED") {
          console.error("Error fetching profile:", err);
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

  // 🔹 Fetch follow stats + follow state
  useEffect(() => {
    // wait until we have the profile user and the session finished loading
    if (!user?._id || status === "loading") return;

    let mounted = true;
    const ctrl = new AbortController();

    (async () => {
      try {
        // ask the server: followers, following, isFollowing (must return boolean)
        const res = await axios.get("/api/follow", {
          params: { userId: user._id },
          signal: ctrl.signal,
          withCredentials: true,
        });

        if (!mounted) return;

        const data = res.data || {};

        // ensure numeric safe values
        setFollowers(Number(data.followers) || 0);
        setFollowing(Number(data.following) || 0);

        // only set boolean if server provides it explicitly; otherwise keep false
        if (typeof data.isFollowing === "boolean") {
          setIsFollowing(data.isFollowing);
        } else {
          // defensive: if server doesn't provide explicit boolean, assume false
          setIsFollowing(false);
        }
      } catch (err) {
        if (err?.code !== "ERR_CANCELED") {
          console.error("Error fetching follow stats:", err);
          // keep prior state — avoid clobbering valid UI with an error
          // but set unknown -> false so button becomes usable
          setIsFollowing((prev) => (prev === null ? false : prev));
        }
      }
    })();

    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [user, status]);

  // 🔹 Toggle follow/unfollow (no optimistic flip — wait for server)
  const toggleFollow = async () => {
    if (!user?._id) return;
    if (status === "loading") return;

    // require login
    if (!session) {
      router.push("/login");
      return;
    }

    setFollowLoading(true);
    try {
      // POST toggles follow, server should respond with { status: 'followed'|'unfollowed', followers: <num>, isFollowing: <bool> }
      const res = await axios.post(
        "/api/follow",
        { targetUserId: user._id },
        { withCredentials: true }
      );

      const data = res.data || {};
      if (data.status === "followed") {
        setIsFollowing(true);
        // prefer authoritative server count if provided
        if (typeof data.followers === "number") setFollowers(data.followers);
        else setFollowers((prev) => prev + 1);
      } else if (data.status === "unfollowed") {
        setIsFollowing(false);
        if (typeof data.followers === "number") setFollowers(data.followers);
        else setFollowers((prev) => Math.max(0, prev - 1));
      } else {
        // fallback: use explicit boolean if server returns it
        if (typeof data.isFollowing === "boolean")
          setIsFollowing(data.isFollowing);
        if (typeof data.followers === "number") setFollowers(data.followers);
      }
    } catch (err) {
      console.error("Follow/unfollow error:", err);
      // optionally: show toast / error to user
    } finally {
      setFollowLoading(false);
    }
  };

  // 🔹 Fetch supporters
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
          withCredentials: true,
        });
        if (!mounted) return;

        setSupporters(res.data?.supporters || []);
      } catch (err) {
        if (err?.code !== "ERR_CANCELED") {
          console.error("Error fetching supporters:", err);
          if (mounted) setSupporters([]);
        }
      }
    })();

    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [user]);

  // 🔹 Redirect self → profile
  useEffect(() => {
    if (status === "loading") return;
    if (!user || !session) return;

    // be defensive: session.user.handle may not be set — compare by id when possible
    if (
      (user.handle && user.handle === session.user.handle) ||
      (user._id && session.user?.id && user._id === session.user.id)
    ) {
      router.replace("/profile");
    }
  }, [user, session, status, router]);

  // --- RENDERING ---
  if (loading || status === "loading") {
    return (
      <div className="w-screen h-screen flex justify-center mt-20">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="text-2xl font-bold text-gray-700">User not found</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="text-2xl font-bold text-gray-700">Login First</div>
      </div>
    );
  }

  return (
    <div>
      {/* Cover & Profile */}
      <div className="Coverpage relative">
        <div className="Coverimage w-full aspect-[4/1] sm:aspect-[5/2] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden">
          <img
            src={user.coverPic || "/model.jpg"}
            alt="Cover"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full flex justify-center">
          <img
            src={user.profilePic || "/profilepic.jpg"}
            alt="Profile"
            className="rounded-full w-20 h-20 -bottom-10 md:w-30 md:h-30 absolute border-4 border-white md:-bottom-15 object-cover"
          />
        </div>
      </div>

      {/* Name + tagline */}
      <div className="flex flex-col gap-1 mt-15 items-center justify-center">
        <div className="font-bold text-xl sm:text-4xl">{user.name}</div>
        <div className="text-gray-800 text-sm sm:text-lg">
          {user.tagline || ""}
        </div>
      </div>

      {/* Glassy card */}
      <div className="flex md:flex-row flex-col p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl gap-6">
        {/* Left Section - Profile Info */}
        <div className="flex flex-col items-center justify-center p-6 w-full md:w-[40%] bg-white/20 rounded-2xl shadow-inner">
          {/* Handle */}
          <h2 className="text-2xl font-bold text-gray-900 drop-shadow-sm">
            @{user.handle}
          </h2>

          {/* Followers & Following */}
          <div className="flex gap-10 mt-5">
            <div
              onClick={() => setModal("followers")}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-xl font-semibold text-gray-900">
                {followers}
              </span>
              <span className="text-sm text-gray-600">Followers</span>
            </div>
            <div
              onClick={() => setModal("following")}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-xl font-semibold text-gray-900">
                {following}
              </span>
              <span className="text-sm text-gray-600">Following</span>
            </div>
          </div>

          {/* Follow Button */}
          <button
            onClick={toggleFollow}
            disabled={followLoading || isFollowing === null}
            className={`mt-6 px-8 py-2.5 rounded-full font-medium transition-all duration-300 shadow-lg ${
              followLoading ? "opacity-70 cursor-not-allowed" : ""
            } ${
              isFollowing
                ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-500 text-white"
            }`}
          >
            {followLoading
              ? "Working..."
              : isFollowing === null
              ? "Loading..."
              : isFollowing
              ? "Unfollow"
              : "Follow"}
          </button>
        </div>

        {/* Right Section - Bio */}
        <div className="flex-1 bg-white/20 rounded-2xl shadow-inner p-6 text-left">
          <h1 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Bio
          </h1>
          <p className="text-base text-gray-700 mt-3 leading-relaxed">
            {user.bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Supporters + Payment */}
      <div className="flex flex-col-reverse md:flex-row md:gap-5 gap-15 basis-1 md:p-8 p-3">
        <div className="supporters border border-black/20 md:basis-1/2 h-100 bg-white/10 backdrop-blur-xl shadow-lg rounded-2xl">
          <div className="p-4">
            <div className="font-bold text-2xl">Supporters</div>
            <ul className="divide-y divide-gray-600 gap-1 px-2 mt-4 h-77 overflow-y-auto">
              {supporters.length === 0 ? (
                <li className="h-full w-full text-center">
                  No supporters found
                </li>
              ) : (
                supporters.map((supporter) => {
                  const sup = supporter.supporter || {};
                  return (
                    <li key={supporter._id || sup._id} className="py-5 p-2">
                      <Link
                        href={`/${sup.handle || ""}`}
                        className="flex gap-2 items-center justify-between"
                      >
                        <div className="flex gap-2 items-center">
                          <img
                            src={sup.profilePic || "/profilepic.jpg"}
                            alt="supporter"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <div className="font-bold">
                              {sup.name || sup.handle || "Unknown"}
                            </div>
                            <div>
                              <i>{sup.handle}</i>
                            </div>
                          </div>
                        </div>
                        <span className="font-bold">
                          ₹{supporter.amount || 0}
                        </span>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>

        <div className="payment md:basis-1/2 min-h-100 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-black/20">
          <Paymentpage user={user} />
        </div>
      </div>

      <FollowersFollowingModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        type={modal}
        handlename={handlename}
      />
    </div>
  );
}
