"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/packages?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/packages");
    }
  }

  return (
    <form onSubmit={handleSearch} className="mt-8 mx-auto w-full max-w-[580px]">
      <div className="flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-md px-4 py-2 shadow-lg transition hover:bg-white/15 focus-within:ring-white/40">
        <Search className="h-5 w-5 shrink-0 text-white/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Where do you want to go?"
          className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none text-sm sm:text-base"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-white/90"
        >
          Search
        </button>
      </div>
    </form>
  );
}
