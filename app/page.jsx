"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session } = useSession();
  const [isSession, setIsSession] = useState(false);

  useEffect(() => {
    if (session) setIsSession(true);
  }, [session]);

  const handleStartPage = () => {
    if (isSession) {
      window.location.href = "/profile";
    } else {
      window.location.href = "/api/auth/signin";
    }
  };
  const handleReadMore = () => {
    window.location.href = "/about";
  };

  return (
    <>
      {/* Hero Section */}
      <motion.div
        className="mb-15"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col justify-center items-center gap-2 my-4">
          <motion.div
            className="flex justify-center gap-2 items-center px-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="/buymeapizza.png"
              alt="Buy me a pizza"
              className="sm:h-60 h-28 md:h-80 lg:h-100"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
            <motion.img
              src="/pizza.png"
              alt="Pizza"
              className="sm:h-60 h-28 lg:h-80"
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </motion.div>

          {/* Text + Buttons */}
          <motion.div
            className="flex flex-col gap-6 items-center text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="text-lg text-gray-900">
              A crowdfunding platform for <i>Individuals</i>.  
              Get funded by your fans and followers. Start now!
            </p>

            <div className="flex gap-4 flex-col sm:flex-row justify-center items-center">
            <div className="relative group inline">
              <button onClick={handleStartPage} className="relative inline-block p-px font-semibold leading-6 text-white hover:bg-gray-900 shadow-2xl cursor-pointer rounded-xl shadow-zinc-600 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10 block px-6 py-3 rounded-xl bg-gradient-to-br from-purple-950 to-blue-950 hover:bg-gray-950 ">
                  <div className="relative z-10 flex items-center space-x-2 ">
                    <span className="transition-all duration-500 group-hover:translate-x-1 font-bold">
                      <span className="relative inline-block overflow-hidden">
                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                          Start my page
                        </span>
                        <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                          Right Now
                        </span>
                      </span>
                    </span>
                    <svg className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1" data-slot="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path clipRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" fillRule="evenodd" />
                    </svg>
                  </div>
                </span>
              </button>
            </div>
            <div className="relative group inline">
              <button onClick={handleReadMore} className="relative text-white inline-block p-px font-semibold leading-6 bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-600 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                  <div className="relative z-10 flex items-center space-x-2">
                    <span className="transition-all duration-500 group-hover:translate-x-1">Read More</span>
                    <svg className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1" data-slot="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path clipRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" fillRule="evenodd" />
                    </svg>
                  </div>
                </span>
              </button>
            </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="bg-white h-0.5 opacity-10"></div>

      {/* Fans Section */}
      <motion.div
        className="container mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } },
        }}
      >
        <h1 className="text-2xl font-bold text-center my-6">
          Your fans can buy you a Pizza
        </h1>
        <div className="flex flex-col md:flex-row gap-10 justify-center">
          {[
            {
              img: "/man.gif",
              title: "Fans want to help",
              desc: "Your fans are available to support",
            },
            {
              img: "/coin.gif",
              title: "Fans want to contribute",
              desc: "Your fans are willing to contribute financially",
            },
            {
              img: "/group.gif",
              title: "Fans want to collaborate",
              desc: "Your fans are ready to collaborate with you",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col text-center space-y-3 justify-center items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img
                className="w-20 h-20 rounded-full p-2 bg-slate-600"
                src={item.img}
                alt={item.title}
              />
              <p className="font-bold">{item.title}</p>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="h-0.5 opacity-10 mt-10"></div>

      {/* Learn More Section */}
      <motion.div
        className="container mx-auto pb-32 pt-14 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center mb-14">
          Learn more about us
        </h2>
        {/* Responsive YouTube embed */}
        <motion.div
          className="w-[90%] h-[40vh] md:w-[50%] md:h-[40vh]"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <iframe
            className="w-full h-full rounded-xl shadow-xl"
            src="https://www.youtube.com/embed/U0d43eaoD-s?si=bdpPGblksrFoQIUw"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </motion.div>
      </motion.div>
    </>
  );
}



