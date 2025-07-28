'use client'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function LayoutContent({ children }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {children}
      </div>
      <Footer />
    </>
  )
}