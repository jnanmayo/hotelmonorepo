/** CMS-ready website content types — populated from API/database at runtime */

export interface WebsiteContact {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  city: string;
  mapEmbedUrl: string;
}

export interface WebsiteSocial {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  videoUrl?: string;
  imageUrl: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  badge: string;
}

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  priceLabel?: string;
  imageUrl: string;
  href: string;
  tag?: string;
}

export interface RoomItem {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  currency: string;
  occupancy: string;
  amenities: string[];
  imageUrl: string;
  virtualTourUrl?: string;
  href: string;
}

export interface DiningVenue {
  id: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  hours?: string;
}

export interface AmenityItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface MeetingSpace {
  id: string;
  name: string;
  capacity: string;
  description: string;
  imageUrl: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface AttractionItem {
  id: string;
  name: string;
  distance: string;
  type: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt: string;
  span?: 'normal' | 'wide' | 'tall';
}

export interface TestimonialItem {
  id: string;
  guest: string;
  rating: number;
  text: string;
  source: string;
  date: string;
}

export interface AwardItem {
  id: string;
  title: string;
  year: string;
}

export interface CorporateFeature {
  id: string;
  title: string;
  description: string;
}

export interface WebsiteContent {
  hotelName: string;
  tagline: string;
  logoUrl: string;
  poweredBy: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  contact: WebsiteContact;
  social: WebsiteSocial;
  hero: HeroContent;
  offers: OfferItem[];
  rooms: RoomItem[];
  dining: DiningVenue[];
  amenities: AmenityItem[];
  meetings: MeetingSpace[];
  experiences: ExperienceItem[];
  attractions: AttractionItem[];
  gallery: GalleryItem[];
  testimonials: TestimonialItem[];
  awards: AwardItem[];
  corporate: {
    headline: string;
    description: string;
    features: CorporateFeature[];
    ctaLabel: string;
    ctaHref: string;
  };
  newsletter: {
    headline: string;
    description: string;
  };
  location: {
    headline: string;
    description: string;
    nearby: AttractionItem[];
  };
}
