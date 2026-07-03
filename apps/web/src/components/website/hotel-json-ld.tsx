import type { WebsiteContent } from '@/features/website/types/content.types';

interface HotelJsonLdProps {
  content: WebsiteContent;
  url?: string;
}

export function HotelJsonLd({ content, url = 'https://tungahotel.com' }: HotelJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: content.hotelName,
    description: content.seo.description,
    url,
    image: content.seo.ogImage,
    telephone: content.contact.phone,
    email: content.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: content.contact.address,
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400051',
      addressCountry: 'IN',
    },
    starRating: { '@type': 'Rating', ratingValue: '5' },
    priceRange: '₹₹₹₹',
    amenityFeature: content.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a.name,
      value: true,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
