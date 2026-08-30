"use client";

import { Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Share:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted hover:bg-muted/80 transition-colors"
      >
        <span className="text-xs font-bold">f</span>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted hover:bg-muted/80 transition-colors"
      >
        <span className="text-xs font-bold">X</span>
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted hover:bg-muted/80 transition-colors"
      >
        <span className="text-xs font-bold">W</span>
      </a>
      <button
        onClick={copyLink}
        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted hover:bg-muted/80 transition-colors"
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
