"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import type { ItineraryDay } from "@/lib/types";
import type { Package } from "@/generated/prisma/client";

type FormDataDay = Record<keyof Omit<ItineraryDay, "day">, string>;

interface Destination { id: string; name: string; slug: string; }

interface PackageFormProps {
  initialData?: Partial<Pick<Package, "title" | "description" | "destinationId" | "imageUrl" | "category" | "tag" | "price" | "duration" | "maxGroupSize" | "rating" | "available" | "highlights" | "itinerary" | "images">>;
  mode: "create" | "update";
  packageId?: string;
}

const emptyDay: FormDataDay = {
  title: "",
  description: "",
  trekTime: "",
  driveTime: "",
  accommodation: "",
  elevation: "",
  distance: "",
  meals: "",
  overnight: "",
};

type PackageFormState = {
  title: string;
  description: string;
  destinationId: string;
  imageUrl: string;
  category: string;
  tag: string;
  price: string;
  duration: string;
  maxGroupSize: string;
  rating: string;
  available: boolean;
  highlights: string;
  itinerary: FormDataDay[];
  images: string[];
};

function makeInitial(data?: PackageFormProps["initialData"]): PackageFormState {
  if (!data) {
    return {
      title: "", description: "", destinationId: "", imageUrl: "",
      category: "trek", tag: "", price: "", duration: "",
      maxGroupSize: "20", rating: "5", available: true,
      highlights: "", itinerary: [], images: [],
    };
  }

  const itinerary: FormDataDay[] = Array.isArray(data.itinerary)
    ? (data.itinerary as unknown as Record<string, string>[]).map((d) => ({
        title: d.title || "", description: d.description || "",
        trekTime: d.trekTime || "", driveTime: d.driveTime || "",
        accommodation: d.accommodation || "", elevation: d.elevation || "",
        distance: d.distance || "", meals: d.meals || "", overnight: d.overnight || "",
      }))
    : [];

  const highlights = Array.isArray(data.highlights)
    ? (data.highlights as string[]).join("\n")
    : "";

  return {
    title: data.title || "", description: data.description || "",
    destinationId: data.destinationId || "",
    imageUrl: data.imageUrl || "",
    category: data.category || "trek", tag: data.tag || "",
    price: String(data.price ?? ""), duration: String(data.duration ?? ""),
    maxGroupSize: String(data.maxGroupSize ?? "20"),
    rating: String(data.rating ?? "5"), available: data.available ?? true,
    highlights, itinerary,
    images: Array.isArray(data.images) ? (data.images as string[]) : [],
  };
}

export function PackageForm({ initialData, mode, packageId }: PackageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(makeInitial(initialData));
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data: Destination[]) => setDestinations(data))
      .catch(() => {});
  }, []);

  function set<K extends keyof PackageFormState>(key: K, value: PackageFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setDay(i: number, key: keyof FormDataDay, value: string) {
    setForm((prev) => {
      const days = [...prev.itinerary];
      days[i] = { ...days[i], [key]: value };
      return { ...prev, itinerary: days };
    });
  }

  function addDay() {
    setForm((prev) => {
      const days = [...prev.itinerary, { ...emptyDay }];
      setOpenDays((s) => new Set(s).add(days.length - 1));
      return { ...prev, itinerary: days };
    });
  }

  function removeDay(i: number) {
    setForm((prev) => {
      const days = prev.itinerary.filter((_, idx) => idx !== i);
      return { ...prev, itinerary: days };
    });
  }

  function toggleDay(i: number) {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function addImage() {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  }

  function removeImage(i: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
  }

  function setImage(i: number, value: string) {
    setForm((prev) => {
      const images = [...prev.images];
      images[i] = value;
      return { ...prev, images };
    });
  }

  function touch(key: string) {
    setTouched((prev) => new Set(prev).add(key));
  }

  function fieldError(key: string): string {
    if (!touched.has(key)) return "";
    switch (key) {
      case "title": return form.title.trim() ? "" : "Title is required";
      case "destinationId": return form.destinationId ? "" : "Destination is required";
      case "description": return form.description.trim() ? "" : "Description is required";
      case "price": return parseFloat(form.price) > 0 ? "" : "Price must be > 0";
      case "duration": return parseInt(form.duration) > 0 ? "" : "Duration must be > 0";
      default: return "";
    }
  }

  function fieldInvalid(key: string) {
    return touched.has(key) && !!fieldError(key);
  }

  function inputClass(key: string) {
    return fieldInvalid(key)
      ? "border-destructive focus-visible:ring-destructive"
      : "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(new Set(["title", "destinationId", "description", "price", "duration"]));

    const body = {
      ...form,
      destinationId: form.destinationId || null,
      price: parseFloat(form.price) || 0,
      duration: parseInt(form.duration) || 1,
      maxGroupSize: parseInt(form.maxGroupSize) || 20,
      rating: parseFloat(form.rating) || 5,
      highlights: form.highlights
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      itinerary: form.itinerary.map((d, i) => ({
        day: String(i + 1),
        title: d.title,
        description: d.description,
        trekTime: d.trekTime || null,
        driveTime: d.driveTime || null,
        accommodation: d.accommodation || null,
        elevation: d.elevation || null,
        distance: d.distance || null,
        meals: d.meals || null,
        overnight: d.overnight || null,
      })),
      images: form.images.filter(Boolean),
    };

    const url = mode === "create"
      ? "/api/admin/packages"
      : `/api/admin/packages/${packageId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success(mode === "create" ? "Package created!" : "Package updated!");
      router.push("/admin/packages");
      router.refresh();
    } else {
      toast.error("Failed to save package");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} onBlur={() => touch("title")} className={inputClass("title")} />
            {fieldError("title") && <p className="text-xs text-destructive">{fieldError("title")}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="destinationId">Destination *</Label>
            <select
              id="destinationId"
              value={form.destinationId}
              onChange={(e) => {
                set("destinationId", e.target.value);
                touch("destinationId");
              }}
              onBlur={() => touch("destinationId")}
              className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${inputClass("destinationId")}`}
            >
              <option value="">Select destination...</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {fieldError("destinationId") && <p className="text-xs text-destructive">{fieldError("destinationId")}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} onBlur={() => touch("description")} className={inputClass("description")} />
            {fieldError("description") && <p className="text-xs text-destructive">{fieldError("description")}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" type="url" value={form.imageUrl} onChange={(e) => { set("imageUrl", e.target.value); setImgLoaded(false); setImgError(false); }} placeholder="https://..." />
            {form.imageUrl && !imgError && (
              <div className="relative mt-2 h-40 w-full overflow-hidden rounded-lg border bg-muted">
                {form.imageUrl && !imgLoaded && !imgError && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">Loading...</div>
                )}
                <Image
                  src={form.imageUrl}
                  alt="Preview"
                  width={600}
                  height={160}
                  className="h-full w-full object-cover"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="trek">Trek</option>
                <option value="tour">Tour</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Input id="tag" value={form.tag} onChange={(e) => set("tag", e.target.value)} placeholder="e.g. Popular Trek" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Images */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Gallery Images</h2>
              <p className="text-xs text-muted-foreground">Additional images for the package carousel</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addImage}>
              <Plus className="h-4 w-4 mr-1" /> Add Image
            </Button>
          </div>

          {form.images.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No gallery images yet. Click "Add Image" to start.
            </p>
          )}

          <div className="space-y-3">
            {form.images.map((url, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setImage(i, e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                {url && (
                  <div className="shrink-0 h-16 w-24 overflow-hidden rounded-lg border bg-muted">
                    <Image
                      src={url}
                      alt={`Gallery ${i + 1}`}
                      width={96}
                      height={64}
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
                <button type="button" onClick={() => removeImage(i)} className="shrink-0 p-2 text-muted-foreground hover:text-destructive" aria-label={`Remove image ${i + 1}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Details */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-lg font-semibold">Pricing & Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input id="price" type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} onBlur={() => touch("price")} className={inputClass("price")} />
              {fieldError("price") && <p className="text-xs text-destructive">{fieldError("price")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days) *</Label>
              <Input id="duration" type="number" value={form.duration} onChange={(e) => set("duration", e.target.value)} onBlur={() => touch("duration")} className={inputClass("duration")} />
              {fieldError("duration") && <p className="text-xs text-destructive">{fieldError("duration")}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxGroupSize">Max Group Size</Label>
              <Input id="maxGroupSize" type="number" value={form.maxGroupSize} onChange={(e) => set("maxGroupSize", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input id="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set("rating", e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="rounded" />
            Available for booking
          </label>
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-lg font-semibold">Highlights</h2>
          <p className="text-xs text-muted-foreground">One highlight per line</p>
          <Textarea
            rows={5}
            value={form.highlights}
            onChange={(e) => set("highlights", e.target.value)}
            placeholder={"360° views at base camp\nTwo base camps in one trek\nStunning Machhapucchre views"}
          />
        </CardContent>
      </Card>

      {/* Itinerary */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Itinerary</h2>
            <Button type="button" variant="outline" size="sm" onClick={addDay}>
              <Plus className="h-4 w-4 mr-1" /> Add Day
            </Button>
          </div>

          {form.itinerary.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No days added yet. Click "Add Day" to start building the itinerary.
            </p>
          )}

          <div className="space-y-2">
            {form.itinerary.map((day, i) => {
              const isOpen = openDays.has(i);
              return (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 p-3 bg-muted/30">
                    <button type="button" onClick={() => toggleDay(i)} className="flex items-center gap-2 flex-1 text-left">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium truncate">{day.title || `Day ${i + 1}`}</span>
                    </button>
                    <button type="button" onClick={() => removeDay(i)} className="p-1 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => toggleDay(i)} className="p-1 text-muted-foreground">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input value={day.title} onChange={(e) => setDay(i, "title", e.target.value)} placeholder="Drive from Kathmandu to Machha Khola" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea rows={2} value={day.description} onChange={(e) => setDay(i, "description", e.target.value)} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Trek Time</Label>
                          <Input value={day.trekTime} onChange={(e) => setDay(i, "trekTime", e.target.value)} placeholder="5-6 hours" />
                        </div>
                        <div className="space-y-2">
                          <Label>Drive Time</Label>
                          <Input value={day.driveTime} onChange={(e) => setDay(i, "driveTime", e.target.value)} placeholder="6-7 hours" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Elevation</Label>
                          <Input value={day.elevation} onChange={(e) => setDay(i, "elevation", e.target.value)} placeholder="930m" />
                        </div>
                        <div className="space-y-2">
                          <Label>Distance</Label>
                          <Input value={day.distance} onChange={(e) => setDay(i, "distance", e.target.value)} placeholder="22 km" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Accommodation</Label>
                          <Input value={day.accommodation} onChange={(e) => setDay(i, "accommodation", e.target.value)} placeholder="Tea House" />
                        </div>
                        <div className="space-y-2">
                          <Label>Meals</Label>
                          <Input value={day.meals} onChange={(e) => setDay(i, "meals", e.target.value)} placeholder="Breakfast, Lunch, Dinner" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Overnight</Label>
                        <Input value={day.overnight} onChange={(e) => setDay(i, "overnight", e.target.value)} placeholder="Machha Khola" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : mode === "create" ? "Create Package" : "Update Package"}
        </Button>
        <Link href="/admin/packages" className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
