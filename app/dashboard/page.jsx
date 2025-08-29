"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loader";
import axios from "axios";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [oldhandle, setHandle] = useState("");
  const [profile, setProfile] = useState(null);
  const [validHandle, setValidHandle] = useState(true);
  const [rpzid, setRpzid] = useState("");
  const [rpzkey, setRpzkey] = useState("");

  const [hasPayment, setHasPayment] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  // Fetch Razorpay details
  useEffect(() => {
    if (status === "authenticated") {
      axios
        .get("/api/setrazorpay")
        .then((res) => {
          if (res.data?.razorpay?.hasCredentials) setHasPayment(true);
        })
        .catch(() => {});
    }
  }, [status]);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  // Fetch profile data
  useEffect(() => {
    if (status === "authenticated" && session?.user?.handle) {
      axios
        .get("/api/getUserProfile", {
          params: { handle: session.user.handle },
        })
        .then((res) => {
          if (res.data?.user) {
            setProfile(res.data.user);
            setHandle(res.data.user.handle);
          }
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
        });
    }
  }, [session, status]);

  // Profile change handler
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "handle") {
      newValue = newValue.trim();
      axios.post("/api/validateHandle", { handle: newValue }).then((res) => {
        setValidHandle(res.data.valid);
      });
    } else if (name === "name" || name === "tagline" || name === "bio") {
      newValue = newValue.trimStart();
    }

    setProfile((prev) => ({ ...prev, [name]: newValue }));
  };

  // Cover pic upload
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("File size < 5MB only");

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, coverPic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Profile pic upload
  const profileimageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("File size < 2MB only");

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Submit profile update
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/updateProfile", profile).then((res) => {
      if (res.status === 200) {
        alert(res.data.message || "Profile updated successfully");
      } else {
        alert(res.data.error || "Error updating profile");
      }
    });
  };

  // Submit payment update
  const handlePaymentSubmit = (e) => {
    setLoadingPayment(true);

    axios
      .post("/api/setrazorpay", { rpzid, rpzkey })
      .then((res) => {
        if (res.status === 200) {
          setHasPayment(true);
          alert(res.data.message || "Payment details updated");
        }
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Something went wrong");
      })
      .finally(() => setLoadingPayment(false));
  };

  if (status === "loading" || !profile) {
    return (
      <div className="w-screen h-screen flex justify-center mt-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:gap-5 gap-15 basis-1 p-4 justify-center">
      {/* Edit Profile */}
      <div className="py-5 border border-gray-600 md:basis-1/2 min-h-100 bg-gray-800/10 backdrop-blur-md shadow-lg shadow-gray-700 rounded-xl">
        <div className="p-4">
          <div className="font-bold text-2xl">Edit Profile</div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
            {/* Cover Pic */}
            <div className="relative">
              <div className="relative w-full aspect-[16/5] overflow-hidden rounded-lg">
                <img
                  src={profile?.coverPic || "/model.jpg"}
                  alt="Cover"
                  onClick={() => coverInputRef.current.click()}
                  className="object-cover w-full h-full cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => coverInputRef.current.click()}
                  className="absolute right-3 top-3 flex items-center gap-2 px-3 py-1 text-xs sm:text-sm bg-black/60 text-white rounded-md hover:bg-black/80 transition-all"
                >
                  Edit Cover
                </button>
                <input
                  onChange={handleCoverChange}
                  ref={coverInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Profile Pic */}
              <div className="w-full flex justify-center relative -mt-10">
                <div className="w-20 h-20 md:w-30 md:h-30 relative flex justify-center items-center rounded-full overflow-hidden group border-3 border-yellow-300/50">
                  <img
                    src={profile?.profilePic || "/profilepic.jpg"}
                    alt="profile"
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                  />
                  <img
                    src="/edit.png"
                    alt="edit"
                    onClick={() => profileInputRef.current.click()}
                    className="absolute w-full h-full rounded-full bg-zinc-800/10 p-8 cursor-pointer opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                  />
                  <input
                    onChange={profileimageChange}
                    ref={profileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Name</label>
              <input
                type="text"
                maxLength={25}
                minLength={3}
                name="name"
                value={profile?.name || ""}
                onChange={handleProfileChange}
                className="font-bold p-2 rounded-md bg-gray-800/10 border border-gray-600 focus:outline-none focus:border-blue-500"
              />

              <label className="text-sm font-semibold">
                Handle
                <span
                  className={`px-2 ${
                    oldhandle === profile?.handle ? "hidden" : ""
                  } ${profile?.handle?.length < 3 ? "hidden" : ""}`}
                >
                  {profile?.handle ? (
                    validHandle ? (
                      <span className="text-green-400">Available</span>
                    ) : (
                      <span className="text-red-400">Handle already taken</span>
                    )
                  ) : (
                    ""
                  )}
                </span>
              </label>
              <input
                type="text"
                maxLength={25}
                minLength={3}
                name="handle"
                value={profile?.handle || ""}
                onChange={handleProfileChange}
                className="block p-2 rounded-md bg-gray-800/10 border border-gray-600 focus:outline-none focus:border-blue-500"
              />

              <label className="text-sm font-semibold">Tagline</label>
              <input
                type="text"
                maxLength={100}
                minLength={3}
                name="tagline"
                value={profile?.tagline || ""}
                onChange={handleProfileChange}
                className="p-2 rounded-md bg-gray-800/10 border border-gray-600 focus:outline-none focus:border-blue-500"
              />

              <label className="text-sm font-semibold">Bio</label>
              <textarea
                name="bio"
                rows={4}
                maxLength={500}
                value={profile?.bio || ""}
                onChange={handleProfileChange}
                placeholder="Write something about yourself..."
                className="p-2 rounded-md bg-gray-800/10 border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
              />

              <button
                disabled={!validHandle}
                className={`${
                  validHandle ? "" : "cursor-not-allowed"
                } mt-2 group relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-sm rounded-xl shadow-zinc-600 transition-transform duration-300 hover:scale-105 active:scale-95`}
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                  Update
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Update */}
      <div className="flex flex-col justify-center md:basis-1/2 h-160 bg-gray-800/10 shadow-lg shadow-gray-700 rounded-xl border border-gray-600">
        <div className="p-10">
          <div className="font-bold mb-4 text-2xl">Update payment details</div>
          <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Razorpay Key Id"
              name="rpzid"
              value={rpzid}
              onChange={(e) => setRpzid(e.target.value)}
              className="border border-gray-600 bg-gray-900/40 text-white rounded-lg p-2"
              required
            />

            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                placeholder="Razorpay Key Secret"
                name="rpzkey"
                value={rpzkey}
                onChange={(e) => setRpzkey(e.target.value)}
                className="w-full border border-gray-600 bg-gray-900/40 text-white rounded-lg p-2 pr-10"
                required
              />
              <span
                className="absolute right-2 top-2 cursor-pointer text-sm text-white"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? " Hide" : " Show"}
              </span>
            </div>

            {hasPayment && (
              <p className="text-green-400 text-sm">
                ✅ Razorpay details already saved
              </p>
            )}

            <button
              type="submit"
              disabled={!rpzid || !rpzkey || loadingPayment}
              className={`${
                !rpzid || !rpzkey || loadingPayment
                  ? "cursor-not-allowed opacity-50"
                  : "hover:scale-105 active:scale-95"
              } mt-2 group relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-sm rounded-xl shadow-zinc-600 transition-transform`}
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                {loadingPayment ? "Saving..." : "Update"}
              </span>
            </button>
          </form>

          <div class=" text-sm text-gray-700 py-3">
            <div class="flex items-start gap-3">
              <svg
                class="w-5 h-5 text-blue-600 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path d="M11 10h2v6h-2zM11 7h2v2h-2z" fill="currentColor" />
              </svg>

              <div>
                <div class="font-medium text-gray-950 ">
                  Razorpay Key ID & Secret
                </div>
                <p class="mt-1 text-gray-800 ">
                  These connect your account to the payment gateway so your page
                  can accept payments securely.
                </p>

                <ol class="mt-2 ml-4 list-decimal space-y-1 text-gray-800 ">
                  <li>
                    Log in to{" "}
                    <a
                      href="https://dashboard.razorpay.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline"
                    >
                      Razorpay Dashboard
                    </a>
                    .
                  </li>
                  <li>
                    Go to <strong>Settings → API Keys</strong>.
                  </li>
                  <li>
                    Click <strong>Generate Key</strong> (choose Live for real
                    payments) and copy both values.
                  </li>
                </ol>

                <div class="mt-2 text-xs text-gray-600 ">
                  Keep these private. <strong>Do not</strong> share the Secret
                  on client-side code or public repos.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
