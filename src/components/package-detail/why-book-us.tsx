import { Shield, Users, MapPin, Headphones, CreditCard, Leaf } from "lucide-react";

const reasons = [
  { icon: Shield, title: "Govt-Registered Agency", desc: "Licensed and certified local Nepal trekking agency" },
  { icon: Users, title: "10,000+ Happy Trekkers", desc: "Trusted by thousands of adventurers from around the world" },
  { icon: MapPin, title: "Local Expertise", desc: "Guides born and raised in the regions you trek" },
  { icon: Headphones, title: "24/7 Support", desc: "Real-time assistance via WhatsApp and email during your trek" },
  { icon: CreditCard, title: "Secure Payments", desc: "No hidden fees — what you see is what you pay" },
  { icon: Leaf, title: "Eco-Conscious", desc: "Responsible trekking with focus on sustainability" },
];

export function WhyBookUs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reasons.map((r) => (
        <div key={r.title} className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <r.icon className="h-5 w-5 text-primary" />
          </span>
          <div>
            <div className="font-medium text-sm">{r.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
