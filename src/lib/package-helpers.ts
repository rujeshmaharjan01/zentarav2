export function mapPackageBody(body: Record<string, any>) {
  return {
    title: body.title,
    description: body.description,
    destination: body.destination,
    imageUrl: body.imageUrl || null,
    category: body.category || "trek",
    tag: body.tag || null,
    price: body.price,
    duration: body.duration,
    maxGroupSize: body.maxGroupSize || 20,
    rating: body.rating ?? 5,
    available: body.available ?? true,
    highlights: body.highlights || [],
    itinerary: body.itinerary || [],
  };
}
