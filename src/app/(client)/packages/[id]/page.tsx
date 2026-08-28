import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { SectionNav } from "@/components/package-detail/section-nav";
import { TripStats } from "@/components/package-detail/trip-stats";
import { Highlights } from "@/components/package-detail/highlights";
import { Itinerary } from "@/components/package-detail/itinerary";
import { IncludeExclude } from "@/components/package-detail/include-exclude";
import { WhyBookUs } from "@/components/package-detail/why-book-us";
import { FaqSection } from "@/components/package-detail/faq-section";
import { SimilarTrips } from "@/components/package-detail/similar-trips";
import { BookingForm } from "@/components/booking-form";
import { Shield, CreditCard, Clock, Star } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({ where: { id } });

  if (!pkg) notFound();

  const highlights = (pkg.highlights as unknown as string[]) || [];
  const itinerary = (pkg.itinerary as unknown as ItineraryDay[]) || [];

  return (
    <>
      <SectionNav />

      <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="space-y-10">
            {/* Hero Image */}
            <section id="overview" className="scroll-mt-28">
              <div className="relative aspect-video lg:aspect-[21/9] rounded-xl overflow-hidden bg-muted">
                {pkg.imageUrl ? (
                  <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                )}
                {pkg.tag && (
                  <Badge className="absolute top-4 left-4" variant="secondary">{pkg.tag}</Badge>
                )}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Badge className="bg-yellow-500 text-white border-0">
                    <Star className="h-3 w-3 fill-white mr-0.5" /> {pkg.rating}
                  </Badge>
                  <span className="text-white text-sm font-medium drop-shadow">{pkg.reviewCount} reviews</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">{pkg.title}</h1>
                <TripStats
                  destination={pkg.destination}
                  duration={pkg.duration}
                  maxGroupSize={pkg.maxGroupSize}
                  rating={pkg.rating}
                  reviewCount={pkg.reviewCount}
                  itinerary={itinerary}
                />
              </div>
            </section>

            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
            </section>

            {/* Highlights */}
            {highlights.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Highlights</h2>
                <Highlights highlights={highlights} />
              </section>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <section id="itinerary" className="scroll-mt-28">
                <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
                <Itinerary itinerary={itinerary} />
              </section>
            )}

            {/* Includes / Excludes */}
            <section id="includes" className="scroll-mt-28">
              <h2 className="text-xl font-semibold mb-4">Includes & Excludes</h2>
              <IncludeExclude />
            </section>

            {/* Why Book With Us */}
            <section id="why-us" className="scroll-mt-28">
              <h2 className="text-xl font-semibold mb-4">Why Book With Us</h2>
              <WhyBookUs />
            </section>

            {/* FAQs */}
            <section id="faqs" className="scroll-mt-28">
              <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
              <FaqSection />
            </section>

            {/* Similar Trips */}
            <section>
              <h2 className="text-xl font-semibold mb-4">You Might Also Like</h2>
              <SimilarTrips category={pkg.category} currentId={pkg.id} />
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <BookingForm packageId={pkg.id} price={pkg.price} />

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
          </div>
        </div>

        {/* Mobile Booking Form — full width below content */}
        <div id="booking" className="lg:hidden pb-20">
          <BookingForm packageId={pkg.id} price={pkg.price} />
        </div>
      </div>

      {/* Mobile fixed CTA bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t p-4 pb-[env(safe-area-inset-bottom)]">
        <div className="container mx-auto flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold">${pkg.price}</div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
          <a
            href="#booking"
            className="shrink-0 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Book Now
          </a>
        </div>
      </div>
    </>
  );
}
