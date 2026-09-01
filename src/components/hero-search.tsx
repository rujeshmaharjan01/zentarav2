"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const popularSearches = [
  "Everest Base Camp",
  "Annapurna Circuit",
  "Pokhara",
  "Chitwan Safari",
  "Langtang Valley",
  "Poon Hill",
];

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

  function handleTagClick(tag: string) {
    router.push(`/packages?q=${encodeURIComponent(tag)}`);
  }

  return (
    <div className="mt-8 mx-auto w-full max-w-145">
      <form onSubmit={handleSearch}>
        <div className="flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-md px-4 py-2 shadow-lg transition hover:bg-white/15 focus-within:ring-white/40">
          <Search className="h-5 w-5 shrink-0 text-white/60" />
          <input
            type="text" inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where do you want to go?"
            className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none text-sm sm:text-base"
          />
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-white px-3 sm:px-4 h-11 text-sm font-medium text-black transition hover:bg-white/90"
                />
              }
            >
              <span className="hidden sm:inline">Search</span>
              <Search className="sm:hidden h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Search packages</TooltipContent>
          </Tooltip>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {popularSearches.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="rounded-full bg-white/10 px-3 py-2 text-sm text-white/80 ring-1 ring-white/15 transition hover:bg-white/20 hover:text-white min-h-[44px] flex items-center"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
