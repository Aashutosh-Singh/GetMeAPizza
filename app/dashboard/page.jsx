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



//.....................................................................................
  // inside Dashboard component

const [hasPayment, setHasPayment] = useState(false);
const [loadingPayment, setLoadingPayment] = useState(false);
const [showKey, setShowKey] = useState(false);

// Fetch Razorpay details
useEffect(() => {
  if (status === "authenticated") {
    axios.get("/api/setrazorpay")
      .then((res) => {
        if (res.data?.razorpay?.hasCredentials) setHasPayment(true);
      })
      .catch(() => {});
  }
}, [status]);

// Submit payment update
const handlePaymentSubmit = (e) => {
  e.preventDefault();
  setLoadingPayment(true);

  axios.post("/api/setrazorpay", { rpzid, rpzkey })
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
//.......................................................................................

  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  // Set profile data
  useEffect(() => {
    if (status === "authenticated") {
      setProfile({
        name: session.user.name || "",
        email: session.user.email,
        handle: session.user.handle || "",
        profilePic: session.user.profilePic || "/profilepic.jpg",
        coverPic: session.user.coverPic || "/model.jpg",
        tagline: session.user.tagline || "",
      });
      setHandle(session.user.handle || "");
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
    } else if (name === "name" || name === "tagline") {
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
 

  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex justify-center mt-20">
        <Loading />
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex flex-col md:flex-row md:gap-5 gap-15 w-screen p-10">
        {/* Edit Profile */}
        <div className="py-5 border border-gray-600 md:w-[48%] min-h-100 bg-gray-800/10 backdrop-blur-md shadow-lg shadow-gray-700 rounded-xl">
          <div className="p-4">
            <div className="font-bold text-2xl">Edit Profile</div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
              {/* Cover Pic */}
              <div className="relative">
                <div className="w-full aspect-[16/5] overflow-hidden">
                  <img
                    src={profile?.coverPic || "/model.jpg"}
                    alt="Cover"
                    onClick={() => coverInputRef.current.click()}
                    className="object-cover w-full h-full rounded-lg cursor-pointer"
                  />
                  <img
                    src={"/edit.png"}
                    alt="edit"
                    onClick={() => coverInputRef.current.click()}
                    className="w-14 h-10 px-3 absolute right-2 bottom-2 bg-zinc-400/40 backdrop-blur-md rounded-lg p-1 cursor-pointer hover:bg-zinc-700 transition-all"
                  />
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
                        <span className="text-red-400">
                          Handle already taken
                        </span>
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
        <div className="flex flex-col justify-center md:w-[48%] h-100 bg-gray-800/10 shadow-lg shadow-gray-700 rounded-xl border border-gray-600">
          <div className="p-10">
            <div className="font-bold mb-4 text-2xl">
              Update payment details
            </div>
            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
  <input
    type="text"
    placeholder="Razorpay Id"
    name="rpzid"
    value={rpzid}
    onChange={(e) => setRpzid(e.target.value)}
    className="border border-gray-600 bg-gray-900/40 text-white rounded-lg p-2"
    required
  />

  <div className="relative">
    <input
      type={showKey ? "text" : "password"}
      placeholder="Razorpay Key"
      name="rpzkey"
      value={rpzkey}
      onChange={(e) => setRpzkey(e.target.value)}
      className="w-full border border-gray-600 bg-gray-900/40 text-white rounded-lg p-2 pr-10"
      required
    />
    <span
      className="absolute right-2 top-2 cursor-pointer text-sm text-gray-400"
      onClick={() => setShowKey(!showKey)}
    >
      {showKey ? "🙈 Hide" : "👁 Show"}
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

          </div>
        </div>
      </div>
    );
  }

  return null;
}
