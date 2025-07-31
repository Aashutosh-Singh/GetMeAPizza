"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut, status } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loader";
export default function dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);
  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex justify-center mt-20">
        <Loading />
      </div>
    );
  }
  if (session) {
    const handleSubmit=(e)=>{
        console.log("Form submitted");
    }
    return (
      <>
        <div>
          <div className="flex flex-col md:flex-row md:gap-5 gap-15 w-screen p-10 ">
            <div className="supporters border-1 border-gray-600 md:w-[48%] h-100 bg-gray-800 shadow-lg shadow-gray-700 rounded-xl">
              <div className="p-4 ">
                <div className="font-bold text-2xl">Profile</div>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 mt-5"
                >
                  <div className="Coverpage  relative ">
                    <div className="Coverimage w-full aspect-[4/1] sm:aspect-[5/2] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden">
                      <img
                        src="/model.jpg"
                        alt="Cover Image"
                        className="object-cover w-full h-full aspect-video rounded-lg"
                      />
                    </div>
                    <div className="w-full flex justify-center">
                      <img
                        src="/model.jpg"
                        alt="profile image"
                        className="rounded-full w-20 h-20 -bottom-10 md:w-30 md:h-30 absolute border-4 border-white md:-bottom-15 object-cover"
                      />
                    </div>
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
}
