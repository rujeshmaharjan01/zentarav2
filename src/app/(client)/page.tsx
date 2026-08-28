import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/package-card";
import Link from "next/link";
import { MapPin, Globe, Shield, DollarSign, Phone, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeroSearch } from "@/components/hero-search";

const features = [
  {
    icon: Globe,
    title: "50+ Destinations",
    desc: "Explore handpicked destinations across all continents",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    desc: "Travel with confidence knowing you're covered",
  },
  {
    icon: DollarSign,
    title: "Best Price Guarantee",
    desc: "Found a lower price elsewhere? We will match it!",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    desc: "Get local support 24/7 during your trip",
  },
];

export default async function HomePage() {
  const [bestSelling, shortTreks, tours] = await Promise.all([
    prisma.package.findMany({
      where: { available: true, category: "trek" },
      orderBy: { reviewCount: "desc" },
      take: 3,
    }),
    prisma.package.findMany({
      where: { available: true, category: "trek", duration: { lte: 10 } },
      orderBy: { duration: "asc" },
      take: 3,
    }),
    prisma.package.findMany({
      where: { available: true, category: "tour" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div className="flex flex-col">
      <section className="relative h-[800px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.pexels.com/videos/35850446/pexels-photo-35850446.jpeg?auto=compress&w=1260&h=750&dpr=1"
          className="absolute inset-0 h-full w-full object-cover hidden md:block"
        >
          <source
            src="https://videos.pexels.com/video-files/35850446/15202819_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <img
          src="https://images.pexels.com/videos/35850446/pexels-photo-35850446.jpeg?auto=compress&w=1260&h=750&dpr=1"
          alt="Himalayan sunset panorama"
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

        <div className="relative z-10 w-full px-4 text-center">
          <div className="mx-auto max-w-[780px]">
            <h1 className="text-white text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight [text-shadow:_0_2px_14px_rgb(0_0_0_/_55%)]">
              Zentara Travels &amp; Tours
            </h1>
            <p className="mt-4 text-white/80 text-2xl sm:text-3xl lg:text-4xl font-medium [text-shadow:_0_2px_10px_rgb(0_0_0_/_45%)]">
              Find Your Inner Journey
            </p>

            <HeroSearch />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group flex items-start gap-3 p-3 text-left transition duration-200 hover:-translate-y-0.5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                    <f.icon className="h-6 w-6 text-[#01aeef]" />
                  </span>
                  <div>
                    <div className="text-white font-semibold text-sm leading-tight [text-shadow:_0_1px_2px_rgb(0_0_0_/_25%)]">
                      {f.title}
                    </div>
                    <div className="mt-1 text-xs leading-snug text-white/80">
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {bestSelling.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8 space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                Our Best Selling Treks
              </h2>
              <p className="text-muted-foreground">
                Not sure what to choose. Let us introduce our most popular adventure treks
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestSelling.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  title={pkg.title}
                  destination={pkg.destination}
                  price={pkg.price}
                  duration={pkg.duration}
                  imageUrl={pkg.imageUrl}
                  maxGroupSize={pkg.maxGroupSize}
                  tag={pkg.tag}
                  rating={pkg.rating}
                  reviewCount={pkg.reviewCount}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/packages" className={buttonVariants({ variant: "outline", size: "lg" })}>
                View All Treks
              </Link>
            </div>
          </div>
        </section>
      )}

      {shortTreks.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="mb-8 space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                Short yet Stunning Treks
              </h2>
              <p className="text-muted-foreground">
                Limited time? Check our curated 2 to 10 day treks
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortTreks.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  title={pkg.title}
                  destination={pkg.destination}
                  price={pkg.price}
                  duration={pkg.duration}
                  imageUrl={pkg.imageUrl}
                  maxGroupSize={pkg.maxGroupSize}
                  tag={pkg.tag}
                  rating={pkg.rating}
                  reviewCount={pkg.reviewCount}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/packages?q=short" className={buttonVariants({ variant: "outline", size: "lg" })}>
                View All Short Treks
              </Link>
            </div>
          </div>
        </section>
      )}

      {tours.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8 space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">Tours</h2>
              <p className="text-muted-foreground">
                Exclusive 1 day and multi-day tours
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  title={pkg.title}
                  destination={pkg.destination}
                  price={pkg.price}
                  duration={pkg.duration}
                  imageUrl={pkg.imageUrl}
                  maxGroupSize={pkg.maxGroupSize}
                  tag={pkg.tag}
                  rating={pkg.rating}
                  reviewCount={pkg.reviewCount}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/packages?category=tour" className={buttonVariants({ variant: "outline", size: "lg" })}>
                View All Tours
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of happy travelers who have discovered their dream
            destinations with us.
          </p>
          <Link href="/packages" className={buttonVariants({ size: "lg" })}>
            <MapPin className="mr-2 h-5 w-5" />
            Explore Destinations
          </Link>
        </div>
      </section>
    </div>
  );
}
