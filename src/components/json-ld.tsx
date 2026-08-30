interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        name: "Zentara Travels",
        url: "https://zentaratravels.com",
        logo: "https://zentaratravels.com/zentaraLogo.svg",
        description: "Nepal's premier trekking and tour company offering guided treks to Everest Base Camp, Annapurna Circuit, and more.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kathmandu",
          addressCountry: "NP",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+977-9851402018",
          contactType: "customer service",
        },
        sameAs: [
          "https://instagram.com/zentaratravels",
          "https://facebook.com/zentaratravels",
          "https://x.com/zentaratravels",
          "https://youtube.com/@zentaratravels",
        ],
      }}
    />
  );
}

interface TouristTripJsonLdProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  price: number;
  duration: string;
}

export function TouristTripJsonLd({ name, description, url, image, price, duration }: TouristTripJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name,
        description,
        url,
        image,
        touristType: "Adventure Traveler",
        itinerary: {
          "@type": "ItemList",
          numberOfItems: parseInt(duration) || 0,
          itemListElement: [],
        },
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      }}
    />
  );
}
