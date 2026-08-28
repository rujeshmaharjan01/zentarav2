"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItineraryDay {
  title: string;
  description: string;
  trekTime: string;
  driveTime: string;
  accommodation: string;
  elevation: string;
  distance: string;
  meals: string;
  overnight: string;
}

interface PackageFormData {
  title: string;
  description: string;
  destination: string;
  imageUrl: string;
  category: string;
  tag: string;
  price: string;
  duration: string;
  maxGroupSize: string;
  rating: string;
  available: boolean;
  highlights: string;
  itinerary: ItineraryDay[];
}

const emptyDay: ItineraryDay = {
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

function makeInitial(data?: Record<string, any>): PackageFormData {
  if (!data) {
    return {
      title: "",
      description: "",
      destination: "",
      imageUrl: "",
      category: "trek",
      tag: "",
      price: "",
      duration: "",
      maxGroupSize: "20",
      rating: "5",
      available: true,
      highlights: "",
      itinerary: [],
    };
  }

  const rawItinerary = data.itinerary;
  let itinerary: ItineraryDay[] = [];
  if (Array.isArray(rawItinerary)) {
    itinerary = rawItinerary.map((d: any) => ({
      title: d.title || "",
      description: d.description || "",
      trekTime: d.trekTime || "",
      driveTime: d.driveTime || "",
      accommodation: d.accommodation || "",
      elevation: d.elevation || "",
      distance: d.distance || "",
      meals: d.meals || "",
      overnight: d.overnight || "",
    }));
  }

  const rawHighlights = data.highlights;
  let highlights = "";
  if (Array.isArray(rawHighlights)) {
    highlights = rawHighlights.join("\n");
  }

  return {
    title: data.title || "",
    description: data.description || "",
    destination: data.destination || "",
    imageUrl: data.imageUrl || "",
    category: data.category || "trek",
    tag: data.tag || "",
    price: String(data.price ?? ""),
    duration: String(data.duration ?? ""),
    maxGroupSize: String(data.maxGroupSize ?? "20"),
    rating: String(data.rating ?? "5"),
    available: data.available ?? true,
    highlights,
    itinerary,
  };
}

interface PackageFormProps {
  initialData?: Record<string, any>;
  mode: "create" | "update";
  packageId?: string;
}

export function PackageForm({ initialData, mode, packageId }: PackageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(makeInitial(initialData));
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));

  function set<K extends keyof PackageFormData>(key: K, value: PackageFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setDay(i: number, key: keyof ItineraryDay, value: string) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body = {
      ...form,
      price: parseFloat(form.price) || 0,
      duration: parseInt(form.duration) || 1,
      maxGroupSize: parseInt(form.maxGroupSize) || 20,
      rating: parseFloat(form.rating) || 5,
      highlights: form.highlights
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      itinerary: form.itinerary.map((d, i) => ({
        day: i + 1,
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
      router.push("/admin/packages");
      router.refresh();
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
            <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <Input id="destination" value={form.destination} onChange={(e) => set("destination", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" type="url" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
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

      {/* Pricing & Details */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-lg font-semibold">Pricing & Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input id="price" type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days) *</Label>
              <Input id="duration" type="number" value={form.duration} onChange={(e) => set("duration", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Trek Time</Label>
                          <Input value={day.trekTime} onChange={(e) => setDay(i, "trekTime", e.target.value)} placeholder="5-6 hours" />
                        </div>
                        <div className="space-y-2">
                          <Label>Drive Time</Label>
                          <Input value={day.driveTime} onChange={(e) => setDay(i, "driveTime", e.target.value)} placeholder="6-7 hours" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Elevation</Label>
                          <Input value={day.elevation} onChange={(e) => setDay(i, "elevation", e.target.value)} placeholder="930m" />
                        </div>
                        <div className="space-y-2">
                          <Label>Distance</Label>
                          <Input value={day.distance} onChange={(e) => setDay(i, "distance", e.target.value)} placeholder="22 km" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
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
