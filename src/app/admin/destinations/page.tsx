"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";

interface Destination {
  id: string;
  slug: string;
  name: string;
  image: string;
  featured: boolean;
  order: number;
  _count: { packages: number };
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/destinations")
      .then((r) => r.json())
      .then((data) => setDestinations(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? Packages linked to this destination will be unlinked.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      toast.success(`Deleted ${name}`);
    } catch {
      toast.error("Failed to delete destination");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Destinations</h1>
        <Link href="/admin/destinations/new">
          <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Add Destination</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Packages</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">No destinations yet.</TableCell>
                  </TableRow>
                ) : (
                  destinations.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Image src={d.image} alt={d.name} width={56} height={40} className="h-10 w-14 rounded object-cover" />
                          {d.name}
                        </div>
                      </TableCell>
                      <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">/{d.slug}</code></TableCell>
                      <TableCell>{d._count.packages}</TableCell>
                      <TableCell>{d.featured && <Badge variant="default"><Star className="h-3 w-3 mr-1" /> Featured</Badge>}</TableCell>
                      <TableCell>{d.order}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/destinations/${d.id}/edit`}>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Pencil className="h-4 w-4" /></Button>
                          </Link>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" disabled={deletingId === d.id} onClick={() => handleDelete(d.id, d.name)}>
                            {deletingId === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
