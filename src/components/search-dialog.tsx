"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { MapPin, Package } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  destination: string;
  type: "package" | "destination";
}

type Destination = { name: string; slug: string; description: string; type: "destination" };

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data: { name: string; slug: string; description: string }[]) => {
        setDestinations(data.map((d) => ({ ...d, type: "destination" as const })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim()) return;
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((r) => r.json())
        .then((data) => setResults(data))
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const filteredDestinations: Destination[] = query.trim()
    ? destinations.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : destinations;

  const handleSelect = useCallback((item: SearchResult | Destination) => {
    setOpen(false);
    setQuery("");
    if ("slug" in item) {
      router.push(`/destinations/${item.slug}`);
    } else {
      router.push(`/packages/${item.id}`);
    }
  }, [router]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors min-h-[44px]"
      >
        <span>Search...</span>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog  open={open} onOpenChange={setOpen}>
        <Command>
        <CommandInput placeholder="Search packages, destinations..." value={query} onValueChange={(val) => { setQuery(val); if (!val.trim()) setResults([]); }} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {results.length > 0 && (
            <CommandGroup heading="Packages">
              {results.map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item)}>
                  <Package className="mr-2 h-4 w-4" />
                  <div>
                    <p>{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.destination}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandGroup heading="Destinations">
            {filteredDestinations.map((d) => (
              <CommandItem key={d.slug} onSelect={() => handleSelect(d)}>
                <MapPin className="mr-2 h-4 w-4" />
                <div>
                  <p>{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.description}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
