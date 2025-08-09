"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loader";
import axios from "axios";
import { set } from "mongoose";
export default function dashboard() {
  const { data: session, status } = useSession();
  const [oldhandle, setHandle] = useState("");
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [validHandle, setValidHandle] = useState(true);
  const coverInputRef=useRef(null);
  const profileInputRef=useRef(null);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

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

  const handleProfileChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "handle") {
      value = value.trim();
      axios.post("/api/validateHandle", { handle: value }).then((res) => {
        if (res.data.valid) {
          setValidHandle(true);
        } else {
          setValidHandle(false);
        }
      });
    } else if (name === "name" || name === "tagline") {
      value = value.trimStart();
    }
    setProfile((prev) => ({ ...prev, [name]: value }));
    console.log("profile: ", profile);
  };
  const handleCoverChange=(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    if(file.size>5*1024*1024){
      return alert("File size should be less than 5MB");
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, coverPic: reader.result }));
    };
    reader.readAsDataURL(file);

  }
  const profileimageChange = (e) => {
    const file=e.target.files[0];
    if(!file) return;
    if(file.size>2*1024*1024){
      return alert("File size should be less than 2MB");
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);

  }
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

  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex justify-center mt-20">
        <Loading />
      </div>
    );
  }

  if (session) {
    return (
      <>
        <div>
          <div className="flex flex-col md:flex-row md:gap-5 gap-15 w-screen p-10 ">
            <div className="py-5 supporters border-1 border-gray-600 md:w-[48%] min-h-100 bg-gray-800/10 backdrop-blur-md shadow-lg shadow-gray-700 rounded-xl">
              <div className="p-4 ">
                <div className="font-bold text-2xl">Edit Profile</div>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 mt-5"
                >
                  <div className="Coverpage  relative ">
                    <div className="Coverimage w-full aspect-[4/1] sm:aspect-[5/2] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden">
                      <img
                        src={profile?.coverPic || "/model.jpg"}
                        alt="Cover Image"
                        onClick={() => coverInputRef.current.click()}
                        className="object-cover w-full h-full aspect-video rounded-lg"
                      />
                      
                        <img
                          src={"/edit.png"}
                          alt="edit icon"
                          onClick={() => coverInputRef.current.click()}
                          className="w-14 h-10 px-3 absolute right-2 bottom-32 bg-zinc-400/40 backdrop-blur-md rounded-lg p-1 cursor-pointer hover:bg-zinc-700 transition-all duration-300"
                        />
                        <input onChange={handleCoverChange} ref={coverInputRef} type="file" className="hidden" accept="image/*"/>
                    </div>
                    <div className="w-full flex justify-center relative">
                      <div className="w-20 h-20 bottom-10 md:bottom-15 md:w-30 md:h-30 relative flex justify-center items-center rounded-full overflow-hidden group border-3 border-yellow-300/50">
                        {/* Profile Image */}
                        <img
                          src={profile?.profilePic || "/profilepic.jpg"}
                          alt="profile image"
                          className="absolute inset-0 w-full h-full object-cover rounded-full z-0"
                        />

                        {/* Edit Icon Overlay */}
                        <img
                          src="/edit.png"
                          alt="edit icon"
                          onClick={() => profileInputRef.current.click()}
                          
                          className="absolute w-full h-full rounded-full z-2 bg-zinc-800/10 p-8 cursor-pointer opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out backdrop-blur-md hover:bg-white/10"
                        />
                        <input onChange={profileimageChange} ref={profileInputRef} type="file" className="hidden" accept="image/*"/>
                      </div>
                    </div>
                  </div>
                  <div className="-mt-10 flex flex-col gap-2">
                    <label className="text-sm font-semibold">Name</label>
                    <input
                      type="text"
                      maxLength={25}
                      minLength={3}
                      name="name"
                      value={profile?.name || ""}
                      onChange={handleProfileChange}
                      className="font-bold p-2 rounded-md bg-gray-800/10 border-1 border-gray-600 focus:outline-none focus:border-blue-500"
                    />

                    <label className="text-sm font-semibold inline">
                      Handle<span className={`px-2 ${oldhandle===profile?.handle ? "hidden" : ""} ${profile?.handle?.length<3?"hidden":""}`}> 
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
                      maxLength={50}
                      minLength={3}
                      name="handle"
                      value={profile?.handle || ""}
                      onChange={handleProfileChange}
                      className="block p-2 rounded-md bg-gray-800/10 border-1 border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <label className="text-sm font-semibold">Tagline</label>
                    <input
                      type="text"
                      maxLength={100}
                      minLength={3}
                      name="tagline"
                      value={profile?.tagline || ""}
                      onChange={handleProfileChange}
                      className="p-2 rounded-md bg-gray-800/10 border-1 border-gray-600 focus:outline-none focus:border-blue-500"
                    />

                    <button disabled={!validHandle} className={`${validHandle?"":"cursor-not-allowed"}  mt-2 group relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-sm cursor-pointer rounded-xl shadow-zinc-600 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95`}>
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                        <div className="relative z-10 flex items-center justify-center space-x-2">
                          <span className="transition-all duration-500 group-hover:translate-x-1">
                            Update
                          </span>
                        </div>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="payment md:w-[48%] h-100 bg-gray-800 shadow-lg shadow-gray-700 rounded-xl border-1 border-gray-600">
              <div className="p-4">
                <div>
                  <div className="font-bold mb-4">Make a payment</div>
                  <div className="flex gap-2 flex-col"></div>
                  <div className="w-full mt-2">{/* payment sortcut */}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return null;
}
