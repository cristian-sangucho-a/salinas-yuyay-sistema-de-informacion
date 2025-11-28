"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function ProductSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [term, setTerm] = useState(searchParams.get("q") || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTerm(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Close search when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        window.innerWidth < 640 // sm breakpoint
      ) {
        if (!term) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [term]);

  const handleSearch = (value: string) => {
    setTerm(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setTerm("");
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    replace(`${pathname}?${params.toString()}`);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative flex justify-end items-center">
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className={`btn btn-ghost btn-circle btn-sm sm:hidden ${
          isExpanded ? "hidden" : "flex"
        }`}
        aria-label="Buscar"
      >
        <FaSearch className="w-4 h-4" />
      </button>

      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className={`
            relative flex items-center transition-all duration-300 ease-in-out
            ${
              isExpanded
                ? "w-full max-w-[200px] opacity-100 visible"
                : "w-0 opacity-0 invisible sm:w-64 sm:opacity-100 sm:visible sm:relative sm:max-w-none"
            }
        `}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar..."
          className="input input-bordered input-sm w-full pr-8 bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary"
          value={term}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {term ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
          >
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        ) : (
          <>
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors hidden sm:block"
            >
              <FaSearch className="w-3.5 h-3.5" />
            </button>
            {/* Close button for mobile when expanded and empty */}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors sm:hidden"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </form>
    </div>
  );
}
