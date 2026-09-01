"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  mainImage?: string | null;
  alt: string;
}

export function ImageGallery({ images, mainImage, alt }: ImageGalleryProps) {
  const allImages = images.length > 0 ? images : mainImage ? [mainImage] : [];
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  function onThumbClick(index: number) {
    setSelected(index);
    api?.scrollTo(index);
  }

  if (allImages.length === 0) {
    return (
      <div className="aspect-video lg:aspect-21/9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {allImages.map((img, i) => (
              <CarouselItem key={i}>
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="relative aspect-video lg:aspect-21/9 rounded-xl overflow-hidden bg-muted block w-full"
                >
                  <Image src={img} alt={`${alt} ${i + 1}`} fill priority={i === 0} sizes="(max-width: 768px) 100vw, min(100vw - 2rem, 1200px)" className="object-cover" />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          {allImages.length > 1 && (
            <>
              <CarouselPrevious className="left-3" />
              <CarouselNext className="right-3" />
            </>
          )}
        </Carousel>

        {allImages.length > 1 && (
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-3">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => onThumbClick(i)}
                  className={cn(
                    "relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden ring-2 transition-all",
                    selected === i ? "ring-primary ring-offset-2" : "ring-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt={`${alt} thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent showCloseButton={false} className="max-w-4xl w-full p-0 bg-black/95 border-0 rounded-xl overflow-hidden">
          <DialogTitle className="sr-only">{alt} - Image {selected + 1} of {allImages.length}</DialogTitle>
          <div className="relative">
            <Image src={allImages[selected]} alt={`${alt} ${selected + 1}`} width={1200} height={800} className="w-full max-h-[80vh] object-contain" />
            {allImages.length > 1 && (
              <>
                <button onClick={() => setSelected((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors" aria-label="Previous image">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={() => setSelected((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors" aria-label="Next image">
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                  {selected + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
