"use client";
import { useSession, signOut, signIn, status } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loader";
import { useEffect } from "react";
export default function profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status == "loading") {
      return;
    }
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);
  if (status == "loading") {
    console.log("loading");
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
          <div className="Coverpage  relative ">
            <div className="Coverimage w-full aspect-[4/1] sm:aspect-[5/2] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden">
              <img
                src="/model.jpg"
                alt="Cover Image"
                className="object-cover w-full h-full aspect-video"
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
          <div className="flex flex-col gap-1 mt-15 items-center justify-center">
            <div className="font-bold">{`${session.user.name}`}</div>
            <div className="text-gray-400 ">Some tag line here</div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-5 gap-15 w-screen p-10 ">
            <div className="supporters border-1 border-gray-600 md:w-[48%] h-100 bg-gray-800 shadow-lg shadow-gray-700 rounded-xl">
              <div className="p-4 ">
                <div className="font-bold text-2xl">Supporters</div>
                <ul className="divide-y divide-gray-600 gap-1 px-2 mt-4 h-77 overflow-y-auto">
                  <li className="flex items-center justify-between py-5 p-2">
                    <div className="flex flex-col">
                      <div>Somme random name</div>
                      <div>emai@something</div>
                    </div>
                    <span className="font-bold">$870</span>
                  </li>
                  <li className="flex items-center justify-between py-5 p-2">
                    <div className="flex flex-col">
                      <div>Somme random name</div>
                      <div>emai@something</div>
                    </div>
                    <span className="font-bold">$870</span>
                  </li>
                  <li className="flex items-center justify-between py-5 p-2">
                    <div className="flex flex-col">
                      <div>Somme random name</div>
                      <div>emai@something</div>
                    </div>
                    <span className="font-bold">$870</span>
                  </li>
                  <li className="flex items-center justify-between py-5 p-2">
                    <div className="flex flex-col">
                      <div>Somme random name</div>
                      <div>emai@something</div>
                    </div>
                    <span className="font-bold">$870</span>
                  </li>
                  <li className="flex items-center justify-between py-5 p-2">
                    <div className="flex flex-col">
                      <div>Somme random name</div>
                      <div>emai@something</div>
                    </div>
                    <span className="font-bold">$870</span>
                  </li>
                  <li className="flex items-center justify-between py-5 p-2">
                    <div className="flex flex-col">
                      <div>Somme random name</div>
                      <div>emai@something</div>
                    </div>
                    <span className="font-bold">$870</span>
                  </li>
                  
                  <li className="flex items-center justify-between py-5 p-2">
                    <div className="flex flex-col">
                      <div>Somme random name</div>
                      <div>emai@something</div>
                    </div>
                    <span className="font-bold">$870</span>
                  </li>
                 
                  <li className="flex items-center justify-between py-5 p-2">
                    <div className="flex flex-col">
                      <div>Somme random name</div>
                      <div>emai@something</div>
                    </div>
                    <span className="font-bold">$870</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="payment md:w-[48%] h-100 bg-gray-800 shadow-lg shadow-gray-700 rounded-xl border-1 border-gray-600">
              <div className="p-4">
                <div>
                  <div className="font-bold mb-4">Make a payment</div>
                  <div className="flex gap-2 flex-col">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      name="amount"
                      placeholder="Enter Amount"
                      className="rounded-lg bg-gray-900 border-1 border-gray-600 p-2 w-full"
                    />

                    <textarea
                      id="message"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your thoughts here..."
                    ></textarea>

                    <button className="overflow-hidden relative w-full p-2 h-10 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer z-10 group ">
                      Pay
                      <span className="absolute w-full h-32 -top-8 -left-2 bg-blue-200 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-bottom" />
                      <span className="absolute w-full h-32 -top-8 -left-2 bg-blue-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-bottom" />
                      <span className="absolute w-full h-32 -top-8 -left-2 bg-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-bottom" />
                      <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-1.5 left-[40%] z-10">
                        Thanks
                      </span>
                    </button>
                  </div>
                  <div className="w-full mt-2">
                    {/* payment sortcut */}
                    <div className="flex h-full justify-center items-center">
                      <div className="flex h-15 gap-x-5 rounded-xl bg-gray-900 px-4 py-1 items-center w-full justify-evenly">
                        <button className="transition-all duration-300 hover:scale-125 flex h-8 !w-10 items-center justify-center rounded-md border border-[#3490f340] bg-gray-900 text-gray-400 shadow-[0px_1px_4px] hover:shadow-[0px_4px_10px] shadow-gray-700">
                          <span className="font-medium text-xl">$5</span>
                        </button>
                        <button className="transition-all duration-300 hover:scale-125 flex h-8 !w-15 items-center justify-center rounded-md border border-[#3490f340] bg-gray-900 text-gray-400 shadow-[0px_1px_4px] hover:shadow-[0px_4px_10px] shadow-gray-700">
                          <span className="font-medium text-xl">$10</span>
                        </button>
                        <button className="transition-all duration-300 hover:scale-125 flex h-8 !w-15 items-center justify-center rounded-md border border-[#3490f340] bg-gray-900 text-gray-400 shadow-[0px_1px_4px] hover:shadow-[0px_4px_10px] shadow-gray-700">
                          <span className="font-medium text-xl">$20</span>
                        </button>
                        <button className="transition-all duration-300 hover:scale-125 flex h-8 !w-15 items-center justify-center rounded-md border border-[#3490f340] bg-gray-900 text-gray-400 shadow-[0px_1px_4px] hover:shadow-[0px_4px_10px] shadow-gray-700">
                          <span className="font-medium text-xl">$30</span>
                        </button>
                        <button className="transition-all duration-300 hover:scale-125 flex h-8 !w-15 items-center justify-center rounded-md border border-[#3490f340] bg-gray-900 text-gray-400 shadow-[0px_1px_4px] hover:shadow-[0px_4px_10px] shadow-gray-700">
                          <span className="font-medium text-xl">$50</span>
                        </button>
                        <button className="transition-all duration-300 hover:scale-125 flex h-8 !w-15 items-center justify-center rounded-md border border-[#3490f340] bg-gray-900 text-gray-400 shadow-[0px_1px_4px] hover:shadow-[0px_4px_10px] shadow-gray-700">
                          <span className="font-medium text-xl">$100</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
