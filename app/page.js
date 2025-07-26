import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col text-[#F5EDED] justify-center items-center gap-2 my-8">
      <div className="font-bold text-5xl flex gap-2">Get me a Pizza
        <img src="pizza.png" alt="pizza" className="w-20 "/></div>
        <div className="flex flex-col gap-6 items-center">
      <p>A crowdfunding platform for <i>Individuals</i>. Get funded by your fans and followers. Start now! </p>
      <div >
        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Start Here
          </span>
          </button>
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Read More
            </span>
            </button>
      </div>
      </div>
</div>
  );
}
