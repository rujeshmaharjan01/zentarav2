import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/package-card";
import { DestinationCard } from "@/components/destination/destination-card";
import { Stars } from "@/components/ui/stars";
import Link from "next/link";
import { Users, Clock, Award, Headphones } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeroSearch } from "@/components/hero-search";
import { OrganizationJsonLd } from "@/components/json-ld";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Zentara Travels - Nepal Tours & Trekking",
  description: "Expert-guided treks and tours in Nepal. Everest Base Camp, Annapurna Circuit, Chitwan Safari. Book your Himalayan adventure.",
  openGraph: {
    title: "Zentara Travels - Nepal Tours & Trekking",
    description: "Expert-guided treks and tours in Nepal. Everest Base Camp, Annapurna Circuit, Chitwan Safari.",
  },
};

export default async function HomePage() {
  let bestSelling: Awaited<ReturnType<typeof prisma.package.findMany<{ include: { destinationRel: { select: { name: true } } } }>>> = [];
  let tours: Awaited<ReturnType<typeof prisma.package.findMany<{ include: { destinationRel: { select: { name: true } } } }>>> = [];
  let destinations: (Awaited<ReturnType<typeof prisma.destination.findMany>>[number] & { _count: { packages: number } })[] = [];
  let reviews: Awaited<ReturnType<typeof prisma.review.findMany<{ include: { user: { select: { name: true } }; package: { select: { title: true } } } }>>> = [];
  try {
    [bestSelling, tours, destinations, reviews] = await Promise.all([
      prisma.package.findMany({
        where: { available: true, category: "trek" },
        orderBy: { reviewCount: "desc" },
        take: 4,
        include: { destinationRel: { select: { name: true } } },
      }),
      prisma.package.findMany({
        where: { available: true, category: "tour" },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { destinationRel: { select: { name: true } } },
      }),
      prisma.destination.findMany({
        where: { featured: true },
        orderBy: { order: "asc" },
        take: 3,
        include: { _count: { select: { packages: { where: { available: true } } } } },
      }),
      prisma.review.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } }, package: { select: { title: true } } },
      }),
    ]);
  } catch {
    // ponytail: DB unavailable at build time on Vercel — fills in at runtime
  }

  return (
    <div className="flex flex-col">
      <OrganizationJsonLd />

      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative min-h-dvh flex items-center justify-center overflow-hidden"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.pexels.com/videos/35850446/pexels-photo-35850446.jpeg?auto=compress&w=600&h=400&dpr=1"
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
        >
          <source
            src="https://videos.pexels.com/video-files/35850446/15202819_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <Image
          src="https://images.pexels.com/videos/35850446/pexels-photo-35850446.jpeg?auto=compress&w=600&h=400&dpr=1"
          alt="Himalayan sunset panorama"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover md:hidden"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/40" />
        <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/60 to-transparent" />

        <div className="relative z-10 w-full px-4 text-center">
          <div className="mx-auto max-w-195">
            <h1
              id="hero-heading"
              className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-7xl lg:whitespace-nowrap font-bold leading-tight [text-shadow:_0_2px_14px_rgb(0_0_0_/_55%)]"
            >
              Zentara Travels &amp; Tours
            </h1>
            <p className="mt-4 text-white/80 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium [text-shadow:_0_2px_10px_rgb(0_0_0_/_45%)]">
              Find Your Inner Journey
            </p>

            <HeroSearch />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Destinations */}
      {destinations.length > 0 && (
        <section
          aria-labelledby="destinations-heading"
          className="py-16 md:py-24 bg-muted/50"
        >
          <div className="container mx-auto px-4">
            <div className="mb-8 space-y-2">
              <h2
                id="destinations-heading"
                className="text-3xl md:text-4xl font-bold"
              >
                Popular Destinations
              </h2>
              <p className="text-muted-foreground">
                Explore the breathtaking landscapes and rich cultures of Asia
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  slug={dest.slug}
                  name={dest.name}
                  description={dest.description}
                  image={dest.image}
                  featured={dest.featured}
                  packageCount={dest._count.packages}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Selling Treks */}
      {bestSelling.length > 0 && (
        <section
          aria-labelledby="best-selling-heading"
          className="py-16 md:py-24"
        >
          <div className="container mx-auto px-4">
            <div className="mb-8 space-y-2">
              <h2
                id="best-selling-heading"
                className="text-3xl md:text-4xl font-bold"
              >
                Our Best Selling Treks
              </h2>
              <p className="text-muted-foreground">
                Not sure what to choose? Let us introduce our most popular
                adventure treks
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {bestSelling.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  title={pkg.title}
                  destination={pkg.destinationRel?.name ?? ""}
                  price={pkg.price}
                  duration={pkg.duration}
                  imageUrl={pkg.imageUrl}
                  category={pkg.category}
                  tag={pkg.tag}
                  rating={pkg.rating}
                  reviewCount={pkg.reviewCount}
                  highlights={(pkg.highlights as string[]) ?? []}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/packages"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                View All Treks
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Tours */}
      {tours.length > 0 && (
        <section aria-labelledby="tours-heading" className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="mb-8 space-y-2">
              <h2 id="tours-heading" className="text-3xl md:text-4xl font-bold">
                Tours
              </h2>
              <p className="text-muted-foreground">
                Exclusive 1 day and multi-day tours
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {tours.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  title={pkg.title}
                  destination={pkg.destinationRel?.name ?? ""}
                  price={pkg.price}
                  duration={pkg.duration}
                  imageUrl={pkg.imageUrl}
                  category={pkg.category}
                  tag={pkg.tag}
                  rating={pkg.rating}
                  reviewCount={pkg.reviewCount}
                  highlights={(pkg.highlights as string[]) ?? []}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/packages?category=tour"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                View All Tours
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section aria-labelledby="why-heading" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 space-y-2">
            <h2 id="why-heading" className="text-3xl md:text-4xl font-bold">
              Why Choose Us
            </h2>
            <p className="text-muted-foreground">
              We make your Himalayan adventure seamless from start to finish
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Expert Local Guides</h3>
              <p className="text-sm text-muted-foreground">
                Certified guides who know every trail and cultural story
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Flexible Booking</h3>
              <p className="text-sm text-muted-foreground">
                Free cancellation up to 30 days before your trip
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Local support team available around the clock during your trip
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Best Price Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                Found a lower price? We will match it, no questions asked
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section
          aria-labelledby="reviews-heading"
          className="py-16 md:py-24 bg-muted/50"
        >
          <div className="container mx-auto px-4">
            <div className="mb-8 space-y-2">
              <h2
                id="reviews-heading"
                className="text-3xl md:text-4xl font-bold"
              >
                What Travelers Say
              </h2>
              <p className="text-muted-foreground">
                Real experiences from real adventurers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border-l-4 border-primary bg-card p-5 space-y-3"
                >
                  <Stars rating={review.rating} />
                  <p className="text-sm text-muted-foreground line-clamp-4 italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="pt-2 border-t flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {(review.user?.name ?? "T").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.user?.name ?? "Traveler"}</p>
                      <p className="text-xs text-muted-foreground">{review.package?.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        aria-labelledby="cta-heading"
        className="py-16 md:py-24 bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold">
            Ready to Start Your Journey?
          </h2>
          <p className="opacity-80 max-w-xl mx-auto">
            Join thousands of happy travelers who have discovered their dream
            destinations with us.
          </p>
          <Link
            href="/packages"
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            Explore Destinations
          </Link>
        </div>
      </section>
    </div>
  );
}
