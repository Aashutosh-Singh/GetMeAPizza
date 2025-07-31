import Image from "next/image";

export default function Home() {
  return (<div className="mb-15">
    <div className="flex flex-col text-[#F5EDED] justify-center items-center gap-2 my-14">
      <div className="font-bold text-5xl flex gap-2 ">Get me a Pizza
        <img src="pizza.png" alt="pizza" className="w-20  animate-bounce"/></div>
        <div className="flex flex-col gap-6 items-center">
      <p>A crowdfunding platform for <i>Individuals</i>. Get funded by your fans and followers. Start now! </p>
      <div className="flex gap-4">
        <div className="relative group inline ">
        <button className="relative inline-block p-px font-semibold leading-6 text-white  hover:bg-gray-900 shadow-2xl cursor-pointer rounded-xl shadow-zinc-600 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500   p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="relative z-10 block px-6 py-3 rounded-xl bg-gradient-to-br from-purple-950 to-blue-950 hover:bg-gray-950 ">
            <div className="relative z-10 flex items-center space-x-2 ">
              <span className="transition-all duration-500 group-hover:translate-x-1 font-bold"><span className="relative inline-block overflow-hidden">
          <span className="block transition-transform duration-300 group-hover:-translate-y-full">
            Start my page
          </span>
          <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
            Right Now
          </span>
        </span></span>
              <svg className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1" data-slot="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" fillRule="evenodd" />
              </svg>
            </div>
          </span>
        </button>
      </div>
      <div className="relative group inline">
        <button className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-600 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
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
      </div>
</div>
<div className="bg-white h-0.5 opacity-10"></div>
<div className="text-[#F5EDED] container mx-auto">
  <h1 className="text-2xl font-bold text-center my-6">Your fans can buy you a Pizza</h1>
  <div className="flex gap-10 justify-center">
    <div className="flex flex-col space-y-3 justify-center items-center">
      <img className="w-20 h-20 rounded-full p-2 bg-slate-600" src="/man.gif"/>
      <p className="font-bold">Fans want to help</p>
      <p>Your fans are available to support </p>
      
    </div>
    <div className="flex flex-col space-y-3 justify-center items-center">
      <img className="w-20 h-20 rounded-full p-2 bg-slate-600" src="/coin.gif"/>
      <p className="font-bold">Fans want to contribute</p>
      <p>Your fans are willing to contribute financially</p>
    </div>
    <div className="flex flex-col space-y-3 justify-center items-center">
      <img className="w-20 h-20 rounded-full p-2 bg-slate-600" src="/group.gif"/>
      <p className="font-bold">Fans want to collaborate</p>
      <p>Your fans are ready to collaborate with you</p>
    </div>
  </div>
  
</div>
<div className="bg-white h-0.5 opacity-10 mt-10"></div>
    <div className="text-white container mx-auto pb-32 pt-14 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-center mb-14">Learn more about us</h2>
        {/* Responsive youtube embed  */}
        <div className="w-[90%] h-[40vh] md:w-[50%] md:h-[40vh] lg:w-[50%] lg:h-[40vh] xl:w-[50%] xl:h-[40vh]">
<iframe className="w-full h-full" src="https://www.youtube.com/embed/U0d43eaoD-s?si=bdpPGblksrFoQIUw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
      
      </div>

</div>
  );
}
