"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Check, X, Loader2, Search, CheckCircle, Download, Eye } from "lucide-react";

interface Booking {
  id: string;
  travelDate: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  specialRequests?: string | null;
  user: { name: string; email: string };
  package: { title: string; price: number; duration: number; destinationRel: { name: string } | null };
}

const statusFilters = ["all", "pending", "confirmed", "completed", "cancelled"] as const;
type StatusFilter = (typeof statusFilters)[number];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  confirmed: { label: "Confirmed", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const statusTimeline = ["pending", "confirmed", "completed"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (filter !== "all" && b.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        const match =
          b.user.name.toLowerCase().includes(q) ||
          b.user.email.toLowerCase().includes(q) ||
          b.package.title.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [bookings, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: bookings.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    for (const b of bookings) {
      if (b.status in c) c[b.status]++;
    }
    return c;
  }, [bookings]);

  async function updateStatus(id: string, status: string) {
    if (!window.confirm(`${status.charAt(0).toUpperCase() + status.slice(1)} this booking?`)) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      setDetailBooking((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
      toast.success(`Booking ${status}`);
    } catch {
      toast.error("Failed to update booking");
    } finally {
      setUpdatingId(null);
    }
  }

  function exportCsv() {
    const headers = ["User", "Email", "Package", "Travel Date", "Booked", "Guests", "Total", "Status"];
    const rows = filtered.map((b) => [
      b.user.name, b.user.email, b.package.title,
      new Date(b.travelDate).toLocaleDateString(),
      new Date(b.createdAt).toLocaleDateString(),
      String(b.guests), `$${b.totalPrice}`, b.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bookings.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Bookings</h1>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download className="h-4 w-4 mr-1.5" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-1.5">
          <Tabs value={filter} onValueChange={(val) => setFilter(val as StatusFilter)}>
            <TabsList>
              {statusFilters.map((s) => (
                <TabsTrigger key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                  <span className="ml-1.5 text-xs opacity-70">{counts[s]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, or package..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>Booked</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      {bookings.length === 0 ? "No bookings yet." : "No bookings match your filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{b.user.name}</p>
                          <p className="text-xs text-muted-foreground">{b.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">{b.package.title}</TableCell>
                      <TableCell>{new Date(b.travelDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{new Date(b.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{b.guests}</TableCell>
                      <TableCell>${b.totalPrice}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[b.status]?.variant || "secondary"}>
                          {statusConfig[b.status]?.label || b.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setDetailBooking(b)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {b.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0" disabled={updatingId === b.id} onClick={() => updateStatus(b.id, "confirmed")}>
                                {updatingId === b.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:text-destructive" disabled={updatingId === b.id} onClick={() => updateStatus(b.id, "cancelled")}>
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          {b.status === "confirmed" && (
                            <Button size="sm" variant="outline" className="h-8 gap-1.5" disabled={updatingId === b.id} onClick={() => updateStatus(b.id, "completed")}>
                              {updatingId === b.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                              Complete
                            </Button>
                          )}
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

      {/* Detail Dialog */}
      <Dialog open={!!detailBooking} onOpenChange={(open) => { if (!open) setDetailBooking(null); }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {detailBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{detailBooking.user.name}</p>
                  <p className="text-xs text-muted-foreground">{detailBooking.user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Package</p>
                  <p className="font-medium">{detailBooking.package.title}</p>
                  <p className="text-xs text-muted-foreground">{detailBooking.package.destinationRel?.name ?? ""} · {detailBooking.package.duration} days</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Travel Date</p>
                  <p className="font-medium">{new Date(detailBooking.travelDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Booked On</p>
                  <p className="font-medium">{new Date(detailBooking.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Guests</p>
                  <p className="font-medium">{detailBooking.guests}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">${detailBooking.totalPrice}</p>
                </div>
              </div>

              {(detailBooking.name || detailBooking.phone || detailBooking.specialRequests) && (
                <div className="rounded-lg border p-3 space-y-2 text-sm">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Info</p>
                  {detailBooking.name && <div><span className="text-muted-foreground">Name:</span> {detailBooking.name}</div>}
                  {detailBooking.phone && <div><span className="text-muted-foreground">Phone:</span> {detailBooking.phone}</div>}
                  {detailBooking.specialRequests && <div><span className="text-muted-foreground">Requests:</span> {detailBooking.specialRequests}</div>}
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-2">Status Timeline</p>
                <div className="flex items-center gap-2">
                  {statusTimeline.map((s, i) => {
                    const statusIdx = statusTimeline.indexOf(detailBooking.status);
                    const isCurrentOrPast = statusIdx >= 0 && i <= statusIdx;
                    const isCancelled = detailBooking.status === "cancelled";
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${isCancelled ? "bg-destructive/10 text-destructive" : isCurrentOrPast ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          {i + 1}
                        </div>
                        <span className={`text-xs ${isCurrentOrPast ? "font-medium" : "text-muted-foreground"}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                        {i < statusTimeline.length - 1 && <div className={`w-6 h-px ${isCancelled ? "bg-destructive/30" : isCurrentOrPast && i < statusIdx ? "bg-primary" : "bg-muted"}`} />}
                      </div>
                    );
                  })}
                  {detailBooking.status === "cancelled" && (
                    <div className="flex items-center gap-2 ml-2">
                      <div className="w-6 h-px bg-destructive/30" />
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-xs font-bold text-destructive">✕</div>
                      <span className="text-xs font-medium text-destructive">Cancelled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
