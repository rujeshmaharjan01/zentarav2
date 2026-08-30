"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PhotoGalleryProps {
  images: string[];
  name: string;
}

export function PhotoGallery({ images, name }: PhotoGalleryProps) {
  const [selected, setSelected] = useState<string | null>(null);
  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button key={i} onClick={() => setSelected(img)} className="overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <AspectRatio ratio={1}>
              <img src={img} alt={`${name} ${i + 1}`} className="h-full w-full object-cover transition-transform hover:scale-105" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
            </AspectRatio>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          {selected && (
            <img src={selected} alt={name} className="w-full h-auto max-h-[85vh] object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
