"use client";
import axios from "axios";
import { redirect } from "next/navigation";
import Loading from "@/components/loader";
import { useEffect, useState } from "react";
import {useSession} from "next-auth/react";
import Link from "next/link";
export default function profile() {
  const [supporters, setSupporters] = useState([]);

  const {data:session, status}=useSession();
  useEffect(()=>{
    if(session){
      axios.get('/api/getSupporters',{params:{userId:session.user._id}}).then((res)=>{
        if(res.data.supporters){
          setSupporters(res.data.supporters);
        }
        else{
          setSupporters([]);
        }
      })
    }
  },[session])

   
    if(status==="loading"){
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
                src={`${session.user.coverPic}`||"/model.jpg"}
                alt="Cover Image"
                className="object-cover w-full h-full aspect-video"
              />
            </div>
            <div className="w-full flex justify-center">
              <img
                src={`${session.user.profilePic}`||"/profilepic.jpg"}
                alt="profile image"
                className="rounded-full w-20 h-20 -bottom-10 md:w-30 md:h-30 absolute border-4 border-white md:-bottom-15 object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-15 items-center justify-center">
            <div className="font-bold text-4xl">{`${session.user.name}`}</div>
            <div className="text-gray-800 text-lg">{`${session.user.tagline}`}</div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-5 gap-15 w-screen p-10 ">
            <div className="supporters border-1 border-gray-600 md:w-[48%] h-100 bg-gray-900/10 backdrop-blur-md shadow-lg shadow-gray-700 rounded-xl">
              <div className="p-4 ">
                <div className="font-bold text-2xl">Supporters</div>
                <ul className="divide-y divide-gray-600 gap-1 px-2 mt-4 h-77 overflow-y-auto">
                  {supporters.length===0?(<li className="h-full w-full text-center">No supporters found</li>):(supporters.map((supporter)=>{
                    return(
                      <li key={supporter._id} className=" py-5 p-2">
                        <Link href={'/' + supporter.supporter.handle} className="flex gap-2 items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <img src={supporter.supporter.profilePic || "/profilepic.jpg"} alt="supporter profile" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex flex-col">
                          <div className="font-bold">{supporter.supporter.name}</div>
                          <div><i>{supporter.supporter.handle}</i></div>
                        </div>
                        </div>
                        <span className="font-bold">₹{supporter.amount}</span>
                        </Link>
                      </li>
                    )
                  }))}
                  
                </ul>
              </div>
            </div>
            <div className="payment md:w-[48%] min-h-100 bg-gray-900/10 backdrop-blur-md shadow-lg shadow-gray-700 rounded-xl border-1 border-gray-600">
                
            </div>
          </div>
        </div>
      </>
    );
  }
  else{
    return redirect('/login');
  }
}
