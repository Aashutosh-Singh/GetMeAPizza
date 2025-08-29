"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  // Dropdown
  const [dropdown, setDropdown] = useState(false);

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);

  // Local fallback data (only used if API is not ready)
  const FALLBACK_CREATORS = useMemo(
    () => [
      { handle: "aash_creates", name: "Aashutosh Singh", profilePic: "/profilepic.png" },
      { handle: "janedoe", name: "Jane Doe", profilePic: "/profilepic.png" },
      { handle: "pixelpanda", name: "Pixel Panda", profilePic: "/profilepic.png" },
      { handle: "devdisha", name: "Disha Dev", profilePic: "/profilepic.png" },
      { handle: "artbyaj", name: "Art by AJ", profilePic: "/profilepic.png" },
      { handle: "chef_nova", name: "Chef Nova", profilePic: "/profilepic.png" },
    ],
    []
  );

  // Open search and autofocus
  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
    setActiveIndex(-1);
  };

  // Debounced search: tries API first, falls back to local list
  useEffect(() => {
    if (!searchOpen) return;

    const q = searchTerm.trim();
    if (q === "") {
      setSearchResults([]);
      setIsSearching(false);
      setActiveIndex(-1);
      return;
    }

    setIsSearching(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        // Hit your API route (see example below)
        const res = await fetch(`/api/search-creators?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });

        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        } else {
          // Fallback: local filter
          const filtered = FALLBACK_CREATORS.filter(
            (c) =>
              c.handle.toLowerCase().includes(q.toLowerCase()) ||
              c.name.toLowerCase().includes(q.toLowerCase())
          );
          setSearchResults(filtered);
        }
      } catch {
        // Fallback on error
        const filtered = FALLBACK_CREATORS.filter(
          (c) =>
            c.handle.toLowerCase().includes(q.toLowerCase()) ||
            c.name.toLowerCase().includes(q.toLowerCase())
        );
        setSearchResults(filtered);
      } finally {
        setIsSearching(false);
        setActiveIndex(0);
      }
    }, 250); // debounce

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [searchTerm, searchOpen, FALLBACK_CREATORS]);

  // Keyboard nav for results
  const onInputKeyDown = (e) => {
    if (!searchResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = searchResults[Math.max(activeIndex, 0)];
      if (target) {
        closeSearch();
        router.push(`/creator/${target.handle}`);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    }
  };

  // Shared styles (kept to your palette)
  const brandBg = "bg-[#FFF991]";
  const brandPanel = "bg-[#FFF991]/95";
  const darkBtn = "bg-slate-900 text-white hover:bg-slate-800";
  const textMuted = "text-slate-600";

  if (session) {
    return (
      <>
        <nav className={`${brandBg} relative flex items-center justify-between px-4 md:px-10 py-1`}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img className="md:h-10 h-8" src="/logo.png" alt="Logo" />
          </Link>

          {/* Search trigger */}
          <button
            onClick={openSearch}
            className={`flex items-center rounded px-3 py-1 sm:py-2 text-xs sm:text-sm shadow-sm ${darkBtn}`}
            type="button"
            aria-label="Open search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="currentColor" className="sm:w-4 sm:h-4 w-3 h-3 mr-2">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd"/>
            </svg>
            Search <span className="hidden sm:flex px-1"> Creators</span>
          </button>

          {/* User */}
          <div className="flex gap-4 md:gap-8 items-center">
            <div className="hidden lg:flex items-center font-bold">
              Welcome&nbsp;<span>{session.user?.name}</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdown((d) => !d)}
                onBlur={() => setTimeout(() => setDropdown(false), 250)}
                className="focus:outline-none"
                aria-haspopup="menu"
                aria-expanded={dropdown}
              >
                <img
                  src={`${session?.user?.profilePic || "/menu.png"}`}
                  className="rounded-full md:w-9 md:h-9 w-6 h-6"
                  alt="User"
                />
              </button>

              {/* Profile dropdown (kept intact, just fixed positioning/z-index) */}
              <div
                className={`absolute bg-amber-300/10 right-0 mt-2 w-56 rounded-lg shadow-lg divide-y divide-gray-200 ${brandPanel} backdrop-blur-md z-50 ${dropdown ? "" : "hidden"}`}
                role="menu"
              >
                <Link href="/profile" className="flex items-center gap-2 p-4 hover:bg-black/5" role="menuitem">
                  <img src={`${session?.user?.profilePic || "/profilepic.jpg"}`} className="w-8 h-8 rounded-full" alt="" />
                  <span>Profile</span>
                </Link>

                <Link href="/dashboard" className="flex items-center gap-2 p-4 hover:bg-black/5" role="menuitem">
                  <img className="w-5" src="/dashboard.png" alt="" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/about" className="flex items-center gap-2 p-4 hover:bg-black/5" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  <span>About</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left flex items-center gap-2 p-4 hover:bg-black/5"
                  role="menuitem"
                >
                  <img className="w-6" src="/exit.png" alt="" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* SEARCH OVERLAY */}
        <div className={`fixed inset-0 z-40 ${searchOpen ? "" : "pointer-events-none"} `}>
          {/* Backdrop */}
          <div
            className={`${searchOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-200 absolute inset-0 bg-black/30`}
            onClick={closeSearch}
          />
          {/* Panel */}
          <div className={`absolute inset-x-0 top-0 ${brandPanel} shadow-lg transition-transform duration-200 ${searchOpen ? "translate-y-0" : "-translate-y-full"}`}>
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search creators by handle (e.g., @aashutosh)"
                  className="w-full bg-white/70 placeholder:text-slate-500 text-slate-800 text-sm border border-slate-300 rounded-md pl-3 pr-28 py-2 focus:outline-none focus:border-slate-500 shadow-sm"
                  aria-autocomplete="list"
                  aria-controls="creator-results"
                />
                <button
                  onClick={closeSearch}
                  className="absolute top-1 right-1 rounded px-2.5 py-1 text-sm border border-slate-300 hover:bg-black/10"
                >
                  Close
                </button>
              </div>

              {/* Results */}
              <div className="mt-3 rounded-md overflow-hidden border border-slate-200 bg-white">
                {isSearching ? (
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded animate-pulse" />
                  </div>
                ) : searchResults.length ? (
                  <ul id="creator-results" role="listbox" className="max-h-80 overflow-auto">
                    {searchResults.map((c, idx) => (
                      <li key={c.handle}>
                        <Link
                          href={`/${c.handle}`}
                          className={`flex items-center gap-3 p-3 hover:bg-slate-50 ${idx === activeIndex ? "bg-slate-100" : ""}`}
                          role="option"
                          aria-selected={idx === activeIndex}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={closeSearch}
                        >
                          <img
                            src={c.profilePic || "/profilepic.png"}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">@{c.handle}</span>
                            {c.name ? <span className={`text-xs ${textMuted}`}>{c.name}</span> : null}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : searchTerm.trim() ? (
                  <div className="p-4 text-sm text-slate-600">No creators found for “{searchTerm}”.</div>
                ) : (
                  <div className="p-4 text-sm text-slate-600">Type a handle to search creators.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Logged-out view (kept color consistent)
  return (
    <nav className={`${brandBg} flex items-center justify-between px-5 py-1`}>
      <Link href="/" className="font-bold flex">
        <img className="md:h-10 h-8" src="/logo.png" alt="Logo" />
      </Link>
      <div className="flex gap-3 text-xs sm:text-md">
      <Link href="/login">
        <button className={`px-2 md:px-5 py-1 sm:py-2 rounded-lg shadow-sm ${darkBtn}`}>
          Login
        </button>
      </Link>
      <Link href="/signup">
        <button className={`px-2 md:px-5 py-1 sm:py-2 rounded-lg shadow-sm ${darkBtn}`}>
          Sign Up
        </button>
      </Link>
      </div>
    </nav>
  );
}
