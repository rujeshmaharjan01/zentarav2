"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/packages?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/packages");
    }
  }

  function handleClear() {
    setQuery("");
    router.push("/packages");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by destination or package name..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Search
      </button>
    </form>
  );
}
