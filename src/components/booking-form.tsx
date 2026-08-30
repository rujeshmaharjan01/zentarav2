"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface BookingFormProps {
  packageId: string;
  price: number;
  maxGroupSize?: number;
}

export function BookingForm({ packageId, price, maxGroupSize = 20 }: BookingFormProps) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = price * guests;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) {
      setError("Please select a travel date");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, travelDate: new Date(date).toISOString(), guests }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create booking");
      }

      toast.success("Booking created!", { description: "Check your email for confirmation." });
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="p-5 border-b">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">${price}</span>
          <span className="text-sm text-muted-foreground">per person</span>
        </div>
      </div>
      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Travel Date</Label>
            <Input id="date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <Input id="guests" type="number" min={1} max={maxGroupSize} value={guests} onChange={(e) => setGuests(parseInt(e.target.value) || 1)} />
          </div>

          <div className="pt-3 border-t">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Book Now
          </Button>
        </form>

        <div className="mt-4 space-y-2">
          {["Satisfied Clients", "Personalised Guide", "Instant Response"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3 w-3 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
