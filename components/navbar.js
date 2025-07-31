'use client'
import {useState} from 'react'
import {useSession, signIn, signOut} from 'next-auth/react'
import Link from 'next/link'
export default function navbar(){
    const {data:session}=useSession();
    
    const [dropdown,setDropdown]=useState(false)
    if(session){
        console.log(session.user.image)
        return(<>
        <nav className="bg-[#021526] text-[#F5EDED] flex items-center justify-between px-10 py-2">
           <Link href="/"><div className="logo font-bold flex">
            <span><img className="w-6" src="/pizza.png"/></span>
            GetMeAPizza</div></Link>
           <div className="flex gap-8 items-center">
                <div className="p-2 items-center cursor-pointer font-bold ">
                    Welcome <span className="text-xl"> {session.user.name}</span>
                </div>
                <button  onClick={()=>{setDropdown(!dropdown);console.log(dropdown)}} onBlur={() => {
            setTimeout(() => {
              setDropdown(false)
            }, 300);
          }}>
                        <img src={`${session.user.image}`} className="rounded-full w-10 h-10"/>
                        
                </button>
           </div>
        </nav>
            <div className={`${dropdown?"":"hidden"} absolute right-15 top-15 divide-y flex flex-col divide-gray-300 rounded-lg font-medium bg-gray-950 z-110`}>
                    <Link href='/profile'><div className="p-4 hover:bg-gray-800 flex gap-2 items-center"><img src={`${session.user.image}`} className="rounded-full w-8 h-8"/>Profile</div></Link>
                    <Link href='/dashboard'><div className="p-4 hover:bg-gray-800 flex gap-2 items-center"><span className="invert"><img className="w-5" src="/dashboard.png"/></span>Dashboard</div></Link>
                    
                    <div onClick={()=>{signOut()}} className="p-4 hover:bg-gray-800 flex gap-2 items-center"><span className="invert"><img className="w-6" src="/exit.png"/></span>Sign Out</div>
                
                    </div>
        </>)
    }
    else{
        return(
        <>
        <nav className="bg-[#021526] text-[#F5EDED] flex items-center justify-between px-5">
           <div className="logo font-bold flex">
            <span><img className="w-6" src="/pizza.png"/></span>
            GetMeAPizza</div>
           {/* <ul className="flex  items-center font-medium">
                <Link href="/"><li className="p-4 hover hover:bg-gradient-to-br from-purple-600 to-blue-500 ">Home</li></Link>
                <Link href="/about"><li className="p-4 hover:bg-gradient-to-br from-purple-600 to-blue-500 " >About</li></Link>
                <Link href="/projects"><li className="p-4 hover:bg-gradient-to-br from-purple-600 to-blue-500 " >Projects</li></Link>
                <Link href="/Signup"><li className="p-4 hover:bg-gradient-to-br from-purple-600 to-blue-500 " >Sign Up</li></Link>
                <Link href="/Login"><li className="p-4 hover:bg-gradient-to-br from-purple-600 to-blue-500 " >Login</li></Link>
           </ul> */}
           <div className="p-2 items-center cursor-pointer"><Link href="/login">
            <div className="relative group inline">
        <button className="relative inline-block p-px font-semibold leading-6 text-white bg-gradient-to-br  hover:bg-gray-900 shadow-2xl cursor-pointer rounded-lg shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
          <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500   p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="relative z-10 block px-6 py-2 rounded-lg bg-gradient-to-br from-purple-950 to-blue-950 hover:bg-gray-950 ">
           
              <span className="transition-all duration-500 group-hover:translate-x-1">Login</span>
              
            
          </span>
        </button>
      </div>
            </Link>
           </div>
        </nav>
        </>
    )
    }
}