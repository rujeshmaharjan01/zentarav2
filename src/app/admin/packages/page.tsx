"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

interface Package {
  id: string;
  title: string;
  destinationRel: { name: string } | null;
  price: number;
  duration: number;
  available: boolean;
  _count: { bookings: number };
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/packages")
      .then((r) => r.json())
      .then((data) => setPackages(data))
      .finally(() => setLoading(false));
  }, []);

  async function toggleAvailable(id: string, current: boolean) {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !current }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, available: !current } : p)));
      toast.success(`Package ${!current ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update package");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Packages</h1>
        <Link href="/admin/packages/new" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-sm font-medium transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          Add Package
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
                  <TableHead>Title</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">No packages yet.</TableCell>
                  </TableRow>
                ) : (
                  packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.title}</TableCell>
                      <TableCell>{pkg.destinationRel?.name ?? ""}</TableCell>
                      <TableCell>${pkg.price}</TableCell>
                      <TableCell>{pkg.duration} days</TableCell>
                      <TableCell>{pkg._count.bookings}</TableCell>
                      <TableCell>
                        <Badge variant={pkg.available ? "default" : "secondary"}>
                          {pkg.available ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAvailable(pkg.id, pkg.available)}
                            disabled={togglingId === pkg.id}
                            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            style={{ backgroundColor: pkg.available ? "hsl(var(--primary))" : "hsl(var(--input))" }}
                            aria-label={pkg.available ? "Deactivate package" : "Activate package"}
                          >
                            <span
                              className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform"
                              style={{ transform: pkg.available ? "translateX(16px)" : "translateX(0)" }}
                            />
                          </button>
                          <Link href={`/admin/packages/${pkg.id}/edit`} className="text-sm text-primary hover:underline py-2 px-3 -my-2 -mx-3 rounded-md">
                            Edit
                          </Link>
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
