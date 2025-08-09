import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import SessionWrapper from '@/components/sessionWrapper'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BuyMeAPizza",
  description: "Fund your project through pizza",
  icon:"/pizza.png"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body  className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative h-full w-full -z-100   bg-[radial-gradient(circle_at_center,#FFF991,transparent)] text-black`}>
        <SessionWrapper>
        <Navbar/>
        <div className="min-h-screen">
        {children}
        </div>
        <Footer/>
        </SessionWrapper>
        
      </body>
    </html>
  );
}
