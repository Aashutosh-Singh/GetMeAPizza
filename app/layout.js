import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GetMeAPizza",
  description: "Fund your project through pizza",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body  className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <Navbar/>
        <div className="absolute top-0 z-[-10] min-h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(50,59,58,0.3),rgba(200,200,200,0))]"></div>
        
        {children}
        
        <Footer/>
      </body>
    </html>
  );
}
