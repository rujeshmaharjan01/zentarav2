"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";

  function handleChange(value: string[]) {
    const val = value[value.length - 1] || "all";
    const params = new URLSearchParams(searchParams.toString());
    if (val !== "all") {
      params.set("category", val);
    } else {
      params.delete("category");
    }
    router.push(`/packages?${params.toString()}`);
  }

  const selected = category === "all" ? [] : [category];

  return (
    <ToggleGroup value={selected} onValueChange={handleChange} className="justify-start">
      <ToggleGroupItem value="all">All</ToggleGroupItem>
      <ToggleGroupItem value="trek">Treks</ToggleGroupItem>
      <ToggleGroupItem value="tour">Tours</ToggleGroupItem>
    </ToggleGroup>
  );
}
