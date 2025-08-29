import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-500 text-sm text-center border-gray-700 py-5 w-full overflow-x-hidden">
      
      
        © {new Date().getFullYear()} Buy Me a Pizza. All rights reserved.
      
    </footer>
  );
}
