"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Minus, Plus, CalendarIcon, ChevronLeft, ChevronRight, MapPin, Users, CreditCard, Shield, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface BookingFormProps {
  packageId: string;
  packageName?: string;
  packageDestination?: string;
  price: number;
  maxGroupSize?: number;
}

interface Availability {
  available: number;
  maxGroupSize: number;
  booked: number;
}

export function BookingForm({ packageId, packageName, packageDestination, price, maxGroupSize = 20 }: BookingFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  // Step
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Trip Details
  const [date, setDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [availLoading, setAvailLoading] = useState(false);

  // Step 2: Contact Info
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Step 3: Confirm
  const [agreed, setAgreed] = useState(false);

  // Submit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name);
      if (session.user.email && !email) setEmail(session.user.email);
    }
  }, [session]);

  // Fetch availability when date changes
  useEffect(() => {
    if (!date) { setAvailability(null); return; }
    setAvailLoading(true);
    const dateStr = format(date, "yyyy-MM-dd");
    fetch(`/api/packages/${packageId}/availability?date=${dateStr}`)
      .then((r) => r.json())
      .then((data: Availability) => setAvailability(data))
      .catch(() => setAvailability(null))
      .finally(() => setAvailLoading(false));
  }, [date, packageId]);

  const totalPrice = price * guests;
  const spotsLeft = availability ? availability.available : null;
  const dateAvailable = !availability || spotsLeft === null ? null : spotsLeft > 0;
  const guestsExceed = spotsLeft !== null && guests > spotsLeft;
  const canProceedStep1 = date && !guestsExceed && dateAvailable !== false;

  function nextStep() {
    if (step === 1 && canProceedStep1) setStep(2);
    else if (step === 2 && name.trim() && email.trim() && phone.trim()) setStep(3);
  }

  function prevStep() {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          travelDate: date.toISOString(),
          guests,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          specialRequests: specialRequests.trim() || undefined,
        }),
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

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="p-5 border-b">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">${price}</span>
          <span className="text-sm text-muted-foreground">per person</span>
        </div>
      </div>

      <div className="p-5">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                step === s ? "bg-primary text-primary-foreground" : step > s ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {step > s ? <Check className="h-3.5 w-3.5" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Trip Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Travel Date</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger
                    render={
                      <button type="button" className="flex h-11 w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
                    }
                  >
                    {date ? format(date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={(day) => { setDate(day); setCalendarOpen(false); }} disabled={(d) => d < new Date()} />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Availability Banner */}
              {date && (
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  {availLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Spinner className="h-3.5 w-3.5" /> Checking availability...
                    </div>
                  ) : dateAvailable === false ? (
                    <div className="text-destructive font-medium">Fully booked — select another date</div>
                  ) : spotsLeft !== null ? (
                    <div className={spotsLeft <= 3 ? "text-orange-600 font-medium" : "text-muted-foreground"}>
                      {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left for this date
                    </div>
                  ) : null}
                </div>
              )}

              <div className="space-y-2">
                <Label>Number of Guests</Label>
                <div className="flex items-center h-11 rounded-lg border bg-background">
                  <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" disabled={guests <= 1} aria-label="Decrease guests">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center text-sm font-medium tabular-nums">{guests}</span>
                  <button type="button" onClick={() => setGuests((g) => Math.min(maxGroupSize, g + 1))} className="h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" disabled={guests >= maxGroupSize || (spotsLeft !== null && guests >= spotsLeft)} aria-label="Increase guests">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {guestsExceed && (
                  <p className="text-xs text-destructive">Only {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} available</p>
                )}
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <Button type="button" className="w-full" size="lg" disabled={!canProceedStep1} onClick={nextStep}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="special">Special Requests</Label>
                <Textarea id="special" rows={3} value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Dietary requirements, accessibility needs, etc." />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button type="button" className="flex-1" disabled={!name.trim() || !email.trim() || !phone.trim()} onClick={nextStep}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-3 text-sm">
                  {packageName && (
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {packageName}
                    </div>
                  )}
                  {packageDestination && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {packageDestination}
                    </div>
                  )}
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{date ? format(date, "PPP") : "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Guests</p>
                      <p className="font-medium">{guests}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-muted-foreground">Contact</p>
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{email}</p>
                      <p className="text-xs text-muted-foreground">{phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Total</p>
                      <p className="text-lg font-bold">${totalPrice}</p>
                      <p className="text-xs text-muted-foreground">${price} × {guests}</p>
                    </div>
                  </div>
                  {specialRequests && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-muted-foreground">Special Requests</p>
                        <p className="text-xs">{specialRequests}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-start gap-2">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
                <Label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                  I agree to the booking terms and cancellation policy
                </Label>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button type="submit" className="flex-1" size="lg" disabled={loading || !agreed}>
                  {loading && <Spinner className="mr-2" />}
                  Book Now
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Trust Signals */}
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
