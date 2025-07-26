import Link from 'next/link'
export default function navbar(){
    return(
        <>
        <nav className="bg-[#000000] text-[#F5EDED] flex items-center justify-between px-5">
           <div className="logo font-bold">GetMeAPizza</div>
           <ul className="flex  items-center font-medium">
                <Link href="/"><li className="p-4 hover hover:bg-[#D72323] ">Home</li></Link>
                <Link href="/about"><li className="p-4 hover:bg-[#D72323] " >About</li></Link>
                <Link href="/projects"><li className="p-4 hover:bg-[#D72323] " >Projects</li></Link>
                <Link href="/Signup"><li className="p-4 hover:bg-[#D72323] " >Sign Up</li></Link>
                <Link href="/Login"><li className="p-4 hover:bg-[#D72323] " >Login</li></Link>
           </ul>
        </nav>
        </>
    )
}