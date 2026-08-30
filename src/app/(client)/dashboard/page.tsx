"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Compass } from "lucide-react";
import { BookingCard } from "./booking-card";

interface Booking {
  id: string;
  travelDate: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  package: {
    id: string;
    title: string;
    destination: string;
    imageUrl?: string | null;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (bookings.length === 0) return;
    const confirmedOrCompleted = bookings.filter(
      (b) => b.status === "confirmed" || b.status === "completed"
    );
    if (confirmedOrCompleted.length === 0) return;

    Promise.all(
      confirmedOrCompleted.map((b) =>
        fetch(`/api/reviews?packageId=${b.package.id}`)
          .then((r) => r.json())
          .then((reviews: Array<{ userId?: string }>) => {
            const hasReviewed = reviews.some((r) => r.userId);
            return hasReviewed ? b.id : null;
          })
          .catch(() => null)
      )
    ).then((ids) => {
      setReviewedIds(new Set(ids.filter(Boolean) as string[]));
    });
  }, [bookings]);

  function handleCancelled() {
    fetchBookings();
  }

  function handleReviewSubmitted() {
    fetchBookings();
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">Manage your travel bookings</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage your travel bookings</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <Compass className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground">No bookings yet.</p>
            <a href="/packages" className="inline-flex items-center text-primary hover:underline font-medium">
              Browse packages →
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={{ ...booking, hasReview: reviewedIds.has(booking.id) }}
              onCancelled={handleCancelled}
              onReviewSubmitted={handleReviewSubmitted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
