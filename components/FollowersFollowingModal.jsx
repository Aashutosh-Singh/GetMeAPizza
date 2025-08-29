"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function FollowersFollowingModal({ isOpen, onClose, type, handlename }) {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch followers/following from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${type}?handle=${handlename}&page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch list");
      const data = await res.json();
      setList((prev) => [...prev, ...data]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Reset list when modal opens or type changes
  useEffect(() => {
    if (isOpen) {
      setList([]);
      setPage(1);
    }
  }, [isOpen, type, handlename]);

  // Fetch data when page changes
  useEffect(() => {
    if (isOpen) fetchData();
  }, [page, isOpen]);

  // Infinite scroll handler
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white/90 w-[400px] h-[500px] rounded-2xl shadow-xl overflow-hidden flex flex-col backdrop-blur-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {type === "followers" ? "Followers" : "Following"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Scrollable List */}
        <div
          className="flex-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          {list.map((user, idx) => (
            <Link key={idx} href={`/${user.username}`}>
              <div
                className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.name}</p>
              </div>
            </div></Link>
          ))}

          {loading && (
            <p className="text-center p-3 text-gray-500">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
