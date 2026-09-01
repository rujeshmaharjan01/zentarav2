"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, ExternalLink, Star, Clock, CheckCircle, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ReviewDialog } from "./review-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  package: {
    id: string;
    title: string;
    imageUrl?: string | null;
    destinationRel: { name: string } | null;
  };
  hasReview?: boolean;
}

interface BookingCardProps {
  booking: Booking;
  onCancelled: () => void;
  onReviewSubmitted: () => void;
}

const statusSteps = ["pending", "confirmed", "completed"];
const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  completed: "outline",
  cancelled: "destructive",
};

function StatusTimeline({ status }: { status: string }) {
  const isCancelled = status === "cancelled";
  const currentIndex = statusSteps.indexOf(status);

  return (
    <div className="flex items-center gap-1.5">
      {statusSteps.map((step, i) => {
        const isComplete = !isCancelled && i <= currentIndex;
        const isCurrent = !isCancelled && i === currentIndex;
        return (
          <div key={step} className="flex items-center gap-1.5">
            {i > 0 && <div className={cn("h-px w-4", isComplete ? "bg-primary" : "bg-muted")} />}
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isCurrent ? "text-primary font-medium" : isComplete ? "text-foreground" : "text-muted-foreground"
            )}>
              {isComplete ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : (
                <Clock className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BookingCard({ booking, onCancelled, onReviewSubmitted }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const canCancel = booking.status === "pending" || booking.status === "confirmed";
  const canReview = (booking.status === "confirmed" || booking.status === "completed") && !booking.hasReview;

  async function handleCancel() {
    if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel booking");
      }
      toast.success("Booking cancelled");
      onCancelled();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel booking";
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      {booking.package.imageUrl && (
        <div className="h-32 sm:h-40 bg-muted">
          <img src={booking.package.imageUrl} alt={booking.package.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{booking.package.title}</CardTitle>
          <Badge variant={statusColors[booking.status] || "secondary"}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <StatusTimeline status={booking.status} />

        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {booking.package.destinationRel?.name ?? ""}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(booking.travelDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {booking.guests} guest{booking.guests > 1 ? "s" : ""}
          </div>
          {booking.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs">📞</span>
              {booking.phone}
            </div>
          )}
        </div>

        <div className="pt-2 border-t flex items-center justify-between">
          <span className="font-semibold">${booking.totalPrice}</span>
          <span className="text-xs text-muted-foreground">
            Booked {new Date(booking.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Link href={`/packages/${booking.package.id}`} className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium border transition-colors",
            "hover:bg-muted"
          )}>
            <ExternalLink className="h-3.5 w-3.5" />
            View Package
          </Link>

          {canReview && (
            <ReviewDialog
              packageId={booking.package.id}
              packageName={booking.package.title}
              onReviewSubmitted={onReviewSubmitted}
            />
          )}

          {booking.hasReview && (
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              Reviewed
            </Badge>
          )}

          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? <Spinner className="mr-1.5" /> : <XCircle className="h-3.5 w-3.5 mr-1.5" />}
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
