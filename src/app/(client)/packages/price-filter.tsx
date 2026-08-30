"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || "5000");

  function handleChange(value: number | readonly number[]) {
    const arr = Array.isArray(value) ? value : [value];
    const [min, max] = arr;
    const params = new URLSearchParams(searchParams.toString());
    if (min > 0) {
      params.set("minPrice", String(min));
    } else {
      params.delete("minPrice");
    }
    if (max < 5000) {
      params.set("maxPrice", String(max));
    } else {
      params.delete("maxPrice");
    }
    router.push(`/packages?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3 min-w-0">
      <Label className="text-sm whitespace-nowrap">Price:</Label>
      <Slider
        value={[minPrice, maxPrice]}
        onValueChange={handleChange}
        max={5000}
        step={100}
        className="w-full sm:w-48"
      />
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        ${minPrice}–${maxPrice}
      </span>
    </div>
  );
}
