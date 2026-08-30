"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Shield, ShieldOff, Download, Eye, Star } from "lucide-react";

interface UserBooking {
  id: string;
  travelDate: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  package: { title: string };
}

interface UserReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  package: { title: string };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  _count: { bookings: number };
}

interface UserDetail extends User {
  bookings: UserBooking[];
  reviews: UserReview[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change this user's role to "${newRole}"?`)) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      toast.success(`User role changed to ${newRole}`);
    } catch {
      toast.error("Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  }

  async function viewUser(id: string) {
    setDetailLoading(true);
    setDetailUser(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();
      setDetailUser(data);
    } catch {
      toast.error("Failed to load user details");
    } finally {
      setDetailLoading(false);
    }
  }

  function exportCsv() {
    const headers = ["Name", "Email", "Role", "Verified", "Bookings", "Joined"];
    const rows = users.map((u) => [
      u.name, u.email, u.role, u.emailVerified ? "Yes" : "No",
      String(u._count.bookings), new Date(u.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "users.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Users</h1>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={users.length === 0}>
          <Download className="h-4 w-4 mr-1.5" /> Export CSV
        </Button>
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
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">No users yet.</TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{u._count.bookings}</TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={u.emailVerified ? "default" : "secondary"}>
                          {u.emailVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => viewUser(u.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 gap-1.5" disabled={updatingId === u.id} onClick={() => toggleRole(u.id, u.role)}>
                            {updatingId === u.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : u.role === "admin" ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                            {u.role === "admin" ? "Demote" : "Promote"}
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

      {/* User Detail Dialog */}
      <Dialog open={!!detailUser || detailLoading} onOpenChange={(open) => { if (!open) { setDetailUser(null); setDetailLoading(false); } }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {detailLoading && (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          )}
          {detailUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{detailUser.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{detailUser.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <Badge variant={detailUser.role === "admin" ? "default" : "secondary"}>{detailUser.role}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(detailUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Bookings ({detailUser.bookings.length})</h3>
                {detailUser.bookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No bookings.</p>
                ) : (
                  <div className="space-y-2">
                    {detailUser.bookings.map((b) => (
                      <div key={b.id} className="flex items-center justify-between text-sm border rounded-lg p-3">
                        <div>
                          <p className="font-medium">{b.package.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(b.travelDate).toLocaleDateString()} · {b.guests} guests</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${b.totalPrice}</p>
                          <Badge variant={b.status === "confirmed" ? "default" : b.status === "cancelled" ? "destructive" : b.status === "completed" ? "outline" : "secondary"} className="text-xs">
                            {b.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Reviews ({detailUser.reviews.length})</h3>
                {detailUser.reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviews.</p>
                ) : (
                  <div className="space-y-2">
                    {detailUser.reviews.map((r) => (
                      <div key={r.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{r.package.title}</p>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                            ))}
                          </div>
                        </div>
                        {r.comment && <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
