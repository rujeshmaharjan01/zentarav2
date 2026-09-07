"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ContactForm({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    if (res.ok) {
      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
    } else {
      toast.error("Failed to send. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" required />
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" name="message" rows={4} required minLength={10} />
      </div>
      <Button type="submit" disabled={loading} className="mt-4">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
