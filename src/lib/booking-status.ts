export const BOOKING_STATUS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  confirmed: { label: "Confirmed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  completed: { label: "Completed", variant: "outline" },
};

export function bookingStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  return BOOKING_STATUS[status]?.variant ?? "secondary";
}

export function bookingStatusLabel(status: string): string {
  return BOOKING_STATUS[status]?.label ?? status;
}
