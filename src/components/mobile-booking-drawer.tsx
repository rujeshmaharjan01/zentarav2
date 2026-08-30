"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerSwipeHandle,
} from "@/components/ui/drawer";
import { BookingForm } from "@/components/booking-form";
import { Shield, CreditCard, Clock } from "lucide-react";

interface MobileBookingDrawerProps {
  packageId: string;
  packageName?: string;
  packageDestination?: string;
  price: number;
  maxGroupSize?: number;
}

export function MobileBookingDrawer({ packageId, packageName, packageDestination, price, maxGroupSize }: MobileBookingDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <button className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t p-4 pb-[env(safe-area-inset-bottom)]" />
        }
      >
        <div className="container mx-auto flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold">${price}</div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
          <span className="shrink-0 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground">
            Book Now
          </span>
        </div>
      </DrawerTrigger>

      <DrawerContent className="max-h-[90dvh]">
        <DrawerSwipeHandle />
        <DrawerHeader>
          <DrawerTitle>Book this trip</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <BookingForm packageId={packageId} packageName={packageName} packageDestination={packageDestination} price={price} maxGroupSize={maxGroupSize} />
          <div className="mt-4 space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary shrink-0" />
              <span>Govt-registered local agency</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-primary shrink-0" />
              <span>Secure payment · No hidden fees</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>Instant confirmation</span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
