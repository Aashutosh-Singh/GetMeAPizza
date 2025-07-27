import Image from "next/image";

export default function Home() {
  return (<div className="mb-15">
    <div className="flex flex-col text-[#F5EDED] justify-center items-center gap-2 my-14">
      <div className="font-bold text-5xl flex gap-2 ">Get me a Pizza
        <img src="pizza.png" alt="pizza" className="w-20 animatepizza animate-bounce"/></div>
        <div className="flex flex-col gap-6 items-center">
      <p>A crowdfunding platform for <i>Individuals</i>. Get funded by your fans and followers. Start now! </p>
      <div >
        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white ">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Start Here
          </span>
          </button>
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Read More
            </span>
            </button>
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
<div className="bg-white h-0.5 opacity-10 my-10"></div>
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
