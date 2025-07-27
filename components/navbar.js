import Link from 'next/link'
export default function navbar(){
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
            <button type="button" className="cursor-pointer text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                Login</button>
            </Link>
           </div>
        </nav>
        </>
    )
}