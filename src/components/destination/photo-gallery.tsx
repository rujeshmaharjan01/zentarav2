"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
          <button key={i} onClick={() => setSelected(img)} className="relative aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <FallbackImage src={img} alt={`${name} ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform hover:scale-105" />
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          {selected && (
            <FallbackImage src={selected} alt={name} width={1200} height={800} className="w-full h-auto max-h-[85vh] object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function FallbackImage({ src, alt, ...props }: { src: string; alt: string } & Record<string, unknown>) {
  const [imgSrc, setImgSrc] = useState(src);
  return <Image src={imgSrc} alt={alt} {...props} onError={() => setImgSrc("/placeholder.svg")} />;
}
