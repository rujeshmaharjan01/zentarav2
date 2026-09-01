"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Place {
  name: string;
  description: string;
  image: string;
}

interface PlacesProps {
  places: Place[];
}

export function Places({ places }: PlacesProps) {
  if (!places.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {places.map((p) => (
        <Card key={p.name} className="overflow-hidden">
          <AspectRatio ratio={16 / 10}>
            <PlaceImage src={p.image} alt={p.name} />
          </AspectRatio>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-1">{p.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PlaceImage({ src, alt }: { src: string; alt: string }) {
  const isValid = src && (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/"));
  const [imgSrc, setImgSrc] = useState(isValid ? src : "/placeholder.svg");
  return <Image src={imgSrc} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" onError={() => setImgSrc("/placeholder.svg")} />;
}
