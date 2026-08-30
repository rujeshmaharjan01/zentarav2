"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  mainImage?: string | null;
  alt: string;
}

export function ImageGallery({ images, mainImage, alt }: ImageGalleryProps) {
  const allImages = images.length > 0 ? images : mainImage ? [mainImage] : [];
  const [selected, setSelected] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="aspect-video lg:aspect-[21/9] rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video lg:aspect-[21/9] rounded-xl overflow-hidden bg-muted">
        <img
          src={allImages[selected]}
          alt={`${alt} ${selected + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden ring-2 transition-all",
                selected === i ? "ring-primary ring-offset-2" : "ring-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img src={img} alt={`${alt} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
