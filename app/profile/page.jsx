"use client";
import FollowersFollowingModal from "@/components/FollowersFollowingModal";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/loader";

export default function ProfilePage() {
  const [supporters, setSupporters] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [modal, setModal] = useState(null);
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.id) return;

    let mounted = true;
    const ctrl = new AbortController();

    (async () => {
      try {
        const [supRes, followRes, profileRes] = await Promise.all([
          axios.get("/api/getSupporters", {
            params: { userId: session.user.id },
            signal: ctrl.signal,
          }),
          axios.get("/api/follow", {
            params: { userId: session.user.id },
            signal: ctrl.signal,
          }),
          axios.get("/api/getUserProfile", {
            params: { handle: session.user.handle },
            signal: ctrl.signal,
          }),
        ]);

        if (!mounted) return;

        // Supporters
        if (supRes.data?.supporters) {
          setSupporters(supRes.data.supporters);
          const total = supRes.data.supporters.reduce(
            (sum, s) => sum + (s.amount || 0),
            0
          );
          setTotalMoney(total);
        }

        // Followers / Following
        if (followRes.data) {
          setFollowers(followRes.data.followers || 0);
          setFollowing(followRes.data.following || 0);
        }

        // Profile Data
        if (profileRes.data?.user) {
          console.log("Profile Data:", profileRes.data.user);
          setProfileData(profileRes.data.user);
        }
      } catch (err) {
        if (err?.code !== "ERR_CANCELED") {
          console.error("Error fetching profile data:", err);
        }
      }
    })();

    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [session]);

  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex justify-center mt-20">
        <Loading />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const user = session.user;
  const profile = profileData || {};

  return (
    <div>
      {/* Cover & Profile */}
      <div className="Coverpage relative">
        <div className="Coverimage w-full aspect-[4/1] sm:aspect-[5/2] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden">
          <img
            src={profile.coverPic || "/model.jpg"}
            alt="Cover"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full flex justify-center">
          <img
            src={profile.profilePic || "/profilepic.jpg"}
            alt="Profile"
            className="rounded-full w-20 h-20 md:w-30 md:h-30 absolute -bottom-10 md:-bottom-15 border-4 border-white object-cover"
          />
        </div>
      </div>

      {/* Name + tagline */}
      <div className="flex flex-col gap-1 mt-15 items-center justify-center">
        <div className="font-bold text-4xl">{profile.name || user.name}</div>
        <div className="text-gray-800 text-lg">{profile.tagline || ""}</div>
      </div>

      {/* Stats & Supporters */}
      <div className="flex flex-col-reverse md:flex-row md:gap-5 gap-15 w-screen p-10">
        {/* Supporters */}
        <div className="supporters border border-gray-600 md:w-[48%] h-100 bg-gray-900/10 backdrop-blur-md shadow-lg rounded-xl">
          <div className="p-4">
            <div className="font-bold text-2xl">Supporters</div>
            <ul className="divide-y divide-gray-600 gap-1 px-2 mt-4 h-77 overflow-y-auto">
              {supporters.length === 0 ? (
                <li className="h-full w-full text-center">No supporters found</li>
              ) : (
                supporters.map((supporter) => (
                  <li key={supporter._id} className="py-5 p-2">
                    <Link
                      href={`/${supporter.supporter?.handle || ""}`}
                      className="flex gap-2 items-center justify-between"
                    >
                      <div className="flex gap-2 items-center">
                        <img
                          src={supporter.supporter?.profilePic || "/profilepic.jpg"}
                          alt="supporter"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <div className="font-bold">
                            {supporter.supporter?.name ||
                              supporter.supporter?.handle ||
                              "Unknown"}
                          </div>
                          <div>
                            <i>@{supporter.supporter?.handle}</i>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold">₹{supporter.amount}</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Profile Info */}
        <div className="payment md:w-[48%] min-h-100 bg-gray-900/10 backdrop-blur-md shadow-lg rounded-xl border border-gray-600 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
            {/* Handle */}
            <div className="rounded-2xl border border-gray-800 bg-white/10 p-6 shadow-sm">
              <div className="text-gray-500 text-sm">Handle</div>
              <div className="text-sm font-semibold text-gray-900 mt-2">
                @{user.handle}
              </div>
            </div>

            {/* Money */}
            <div className="rounded-2xl border border-gray-800 bg-white/10 p-6 shadow-sm">
              <div className="text-gray-500 text-sm">Total Money Received</div>
              <div className="text-3xl font-semibold text-green-600 mt-2">
                ₹{totalMoney}
              </div>
            </div>

            {/* Followers */}
            <div
              onClick={() => setModal("followers")}
              className="rounded-2xl border border-gray-800 bg-white/10 p-6 shadow-sm cursor-pointer"
            >
              <div className="text-gray-500 text-sm">Followers</div>
              <div className="text-3xl font-semibold text-gray-900 mt-2">
                {followers}
              </div>
            </div>

            {/* Following */}
            <div
              onClick={() => setModal("following")}
              className="rounded-2xl border border-gray-800 bg-white/10 p-6 shadow-sm cursor-pointer"
            >
              <div className="text-gray-500 text-sm">Following</div>
              <div className="text-3xl font-semibold text-gray-900 mt-2">
                {following}
              </div>
            </div>

            {/* About Me */}
            <div className="rounded-2xl border border-gray-800 bg-white/10 p-6 shadow-sm md:col-span-2">
              <div className="text-gray-500 text-sm mb-2">About Me</div>
              <p className="text-gray-800 leading-relaxed">
                {profile.bio ||
                  "This is your bio. Tell your supporters about yourself ✨"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <FollowersFollowingModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        type={modal}
        handlename={session.user.handle}
      />
    </div>
  );
}
