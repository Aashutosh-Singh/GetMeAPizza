'use client'
import {useEffect} from 'react'
import {useSession, signIn, signOut,status} from 'next-auth/react'
import {useRouter} from 'next/navigation'
import Loading from '@/components/loader'
export default function dashboard(){
    const {data:session,status}=useSession();
    const router=useRouter();
    useEffect(()=>{
        if(status==="loading"){return}
        if(!session){router.push('/login')}
    },[session, status, router])
    if(status==="loading"){return(<div className="w-screen h-screen flex justify-center mt-20">
            <Loading/>
        </div>)}
    if(session){
        return(
            <div>
                This is dashboard
            </div>
        )
    }
    
}