"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

export function DestinationForm({ mode, id }: { mode: "create" | "update"; id?: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === "update");
  const [form, setForm] = useState({
    slug: "", name: "", description: "", image: "", heroImage: "",
    continent: "Asia", bestTime: "", travelTips: "", featured: false, order: 0,
  });
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState("");
  const [places, setPlaces] = useState<{ name: string; description: string; image: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "update" && id) {
      fetch(`/api/admin/destinations/${id}`)
        .then((r) => r.json())
        .then((data: any) => {
          setForm({
            slug: data.slug, name: data.name, description: data.description,
            image: data.image, heroImage: data.heroImage || "",
            continent: data.continent, bestTime: data.bestTime, travelTips: data.travelTips,
            featured: data.featured, order: data.order,
          });
          setHighlights(data.highlights || []);
          setGallery(data.gallery || []);
          setPlaces(data.places || []);
        })
        .finally(() => setLoading(false));
    }
  }, [id, mode]);

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.image.trim()) e.image = "Image URL is required";
    if (!form.bestTime.trim()) e.bestTime = "Best time is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const method = mode === "create" ? "POST" : "PUT";
      const url = mode === "create" ? "/api/admin/destinations" : `/api/admin/destinations/${id}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, highlights, gallery, places }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${mode}`);
      }
      toast.success(`Destination ${mode === "create" ? "created" : "updated"}`);
      router.push("/admin/destinations");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${mode}`);
    } finally {
      setSaving(false);
    }
  }

  function addHighlight() {
    if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput("");
    }
  }

  function addGalleryImage() {
    if (galleryInput.trim() && !gallery.includes(galleryInput.trim())) {
      setGallery([...gallery, galleryInput.trim()]);
      setGalleryInput("");
    }
  }

  function addPlace() {
    setPlaces([...places, { name: "", description: "", image: "" }]);
  }

  function updatePlace(index: number, field: "name" | "description" | "image", value: string) {
    setPlaces(places.map((p, i) => i === index ? { ...p, [field]: value } : p));
  }

  function removePlace(index: number) {
    setPlaces(places.filter((_, i) => i !== index));
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">{mode === "create" ? "New" : "Edit"} Destination</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value, slug: mode === "create" ? (form.slug || autoSlug(e.target.value)) : form.slug }); }} className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={errors.slug ? "border-destructive" : ""} />
                {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={errors.description ? "border-destructive" : ""} />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image">Image URL *</Label>
                <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={errors.image ? "border-destructive" : ""} />
                {errors.image && <p className="text-xs text-destructive mt-1">{errors.image}</p>}
              </div>
              <div>
                <Label htmlFor="heroImage">Hero Image URL</Label>
                <Input id="heroImage" value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="continent">Continent</Label>
                <Input id="continent" value={form.continent} onChange={(e) => setForm({ ...form, continent: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input id="order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.featured} onCheckedChange={(checked) => setForm({ ...form, featured: checked })} />
              <Label>Featured destination</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Best Time to Visit *</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={2} value={form.bestTime} onChange={(e) => setForm({ ...form, bestTime: e.target.value })} placeholder="e.g. Sep-Nov for clear skies, Mar-May for blooms..." className={errors.bestTime ? "border-destructive" : ""} />
            {errors.bestTime && <p className="text-xs text-destructive mt-1">{errors.bestTime}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Travel Tips</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={4} value={form.travelTips} onChange={(e) => setForm({ ...form, travelTips: e.target.value })} placeholder="Practical advice for travelers..." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Highlights</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Add a highlight" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }} />
              <Button type="button" variant="outline" onClick={addHighlight}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {highlights.map((h, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-sm px-2.5 py-1 rounded-full">
                  {h}
                  <button type="button" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Places</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {places.map((p, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3 relative">
                <button type="button" onClick={() => removePlace(i)} className="absolute top-2 right-2 text-destructive hover:text-destructive/80"><X className="h-4 w-4" /></button>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Place name" value={p.name} onChange={(e) => updatePlace(i, "name", e.target.value)} />
                  <Input placeholder="Image URL" value={p.image} onChange={(e) => updatePlace(i, "image", e.target.value)} />
                </div>
                <Textarea placeholder="Description" rows={2} value={p.description} onChange={(e) => updatePlace(i, "description", e.target.value)} />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addPlace}><Plus className="h-4 w-4 mr-1.5" /> Add Place</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Photo Gallery</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} placeholder="Image URL" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGalleryImage(); } }} />
              <Button type="button" variant="outline" onClick={addGalleryImage}>Add</Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((url, i) => (
                <div key={i} className="relative group">
                  <Image src={url} alt="" width={96} height={80} className="w-full h-20 object-cover rounded" />
                  <button type="button" onClick={() => setGallery(gallery.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {mode === "create" ? "Create Destination" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
