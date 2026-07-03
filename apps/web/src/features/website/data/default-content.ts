import type { WebsiteContent } from '@/features/website/types/content.types';

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

/** Default tenant content — replace via GET /api/public/website/:hotelSlug */
export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
  hotelName: 'Tunga International Hotel',
  tagline: 'Experience True Hospitality',
  logoUrl: '/brand/tunga-logo.svg',
  poweredBy: 'TungaOS · Sharada Sama Solutions',
  seo: {
    title: 'Tunga International Hotel | Luxury Business Hotel in BKC Mumbai',
    description:
      'Book direct at Tunga International Hotel, BKC Mumbai. Best rate guarantee, luxury rooms, fine dining, meetings & corporate packages. Powered by TungaOS.',
    keywords: [
      'luxury hotel Mumbai',
      'BKC hotel',
      'business hotel Mumbai',
      'direct booking hotel',
      'Tunga International',
    ],
    ogImage: IMG('photo-1566073771259-6a8506099945'),
  },
  contact: {
    phone: '+91 22 1234 5678',
    email: 'reservations@tungahotel.com',
    whatsapp: '919876543210',
    address: 'Plot No. 123, Bandra Kurla Complex, Mumbai',
    city: 'Mumbai, Maharashtra 400051',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.8656!3d19.0596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzM0LjYiTiA3MsKwNTEnNTYuMiJF!5e0!3m2!1sen!2sin!4v1',
  },
  social: {
    instagram: 'https://instagram.com/tungahotel',
    facebook: 'https://facebook.com/tungahotel',
    linkedin: 'https://linkedin.com/company/tungahotel',
  },
  hero: {
    eyebrow: '— EXPERIENCE TRUE HOSPITALITY',
    title: 'Stay in the Heart of Mumbai\'s Business Hub',
    subtitle:
      'Premium accommodations in BKC with world-class dining, meeting spaces, and unparalleled service for business and leisure travelers.',
    imageUrl: IMG('photo-1566073771259-6a8506099945'),
    ctaPrimary: { label: 'Book Direct & Save', href: '/book' },
    ctaSecondary: { label: 'View Rooms', href: '/rooms' },
    badge: 'Best Rate Guarantee',
  },
  offers: [
    { id: '1', title: 'Weekend Escape', description: '20% off Fri–Sun stays with breakfast included.', priceLabel: 'From ₹6,999', imageUrl: IMG('photo-1631049307264-da0ec9d70304'), href: '/offers', tag: 'Popular' },
    { id: '2', title: 'Corporate Rate', description: 'Exclusive rates for business travelers & long stays.', priceLabel: 'Save 25%', imageUrl: IMG('photo-1520250497591-112f2f40a3f4'), href: '/corporate', tag: 'Corporate' },
    { id: '3', title: 'Stay 3 Pay 2', description: 'Extended stay offer for leisure guests.', priceLabel: '3rd Night Free', imageUrl: IMG('photo-1598928506311-c55eab6857f7'), href: '/offers' },
    { id: '4', title: 'Airport Pickup', description: 'Complimentary airport transfer on direct bookings.', imageUrl: IMG('photo-1436491865332-7a61a109cc05'), href: '/offers' },
    { id: '5', title: 'Restaurant Discount', description: '15% off at our signature restaurant for in-house guests.', imageUrl: IMG('photo-1414235077428-338989a2e8c0'), href: '/dining' },
    { id: '6', title: 'Spa Package', description: 'Rejuvenate with our luxury spa & wellness package.', imageUrl: IMG('photo-1540555700478-4be289fbecef'), href: '/offers', tag: 'Wellness' },
  ],
  rooms: [
    { id: '1', name: 'Executive Room', description: 'Sophisticated comfort with city views and premium bedding.', priceFrom: 7499, currency: 'INR', occupancy: '2 Guests', amenities: ['King Bed', 'City View', 'Work Desk', 'Rain Shower'], imageUrl: IMG('photo-1631049307264-da0ec9d70304'), href: '/rooms', virtualTourUrl: '#' },
    { id: '2', name: 'Deluxe Suite', description: 'Separate living area, executive lounge access, and butler service.', priceFrom: 12999, currency: 'INR', occupancy: '3 Guests', amenities: ['Living Room', 'Lounge Access', 'Bathtub', 'Minibar'], imageUrl: IMG('photo-1598928506311-c55eab6857f7'), href: '/rooms' },
    { id: '3', name: 'Presidential Suite', description: 'The pinnacle of luxury with panoramic views and private dining.', priceFrom: 24999, currency: 'INR', occupancy: '4 Guests', amenities: ['Private Dining', 'Panoramic View', 'Jacuzzi', 'Personal Butler'], imageUrl: IMG('photo-1582719478250-c89cae4dc85b'), href: '/rooms', virtualTourUrl: '#' },
  ],
  dining: [
    { id: '1', name: 'The Tunga Restaurant', type: 'Fine Dining', description: 'Contemporary Indian & international cuisine by our award-winning chefs.', imageUrl: IMG('photo-1414235077428-338989a2e8c0'), hours: '7 AM – 11 PM' },
    { id: '2', name: 'Aura Café', type: 'All-Day Café', description: 'Artisan coffee, pastries, and light bites in an elegant setting.', imageUrl: IMG('photo-1559927493-0d0b0c7d5b3e'), hours: '6 AM – 10 PM' },
    { id: '3', name: 'Skyline Bar', type: 'Bar & Lounge', description: 'Craft cocktails and premium spirits with skyline views.', imageUrl: IMG('photo-1470337458703-46ad1756a187'), hours: '5 PM – 1 AM' },
  ],
  amenities: [
    { id: '1', name: 'Swimming Pool', description: 'Rooftop infinity pool with city views', icon: 'pool' },
    { id: '2', name: 'Fitness Centre', description: '24/7 state-of-the-art gym', icon: 'gym' },
    { id: '3', name: 'Luxury Spa', description: 'Ayurvedic & international treatments', icon: 'spa' },
    { id: '4', name: 'Conference Hall', description: 'Flexible MICE spaces up to 500 guests', icon: 'conference' },
    { id: '5', name: 'High-Speed WiFi', description: 'Complimentary throughout the hotel', icon: 'wifi' },
    { id: '6', name: 'Airport Transfer', description: 'Premium chauffeur service', icon: 'transfer' },
    { id: '7', name: 'Valet Parking', description: 'Secure underground parking', icon: 'parking' },
    { id: '8', name: 'Business Centre', description: 'Printing, meetings & secretarial services', icon: 'business' },
  ],
  meetings: [
    { id: '1', name: 'Grand Ballroom', capacity: '500 guests', description: 'Weddings, galas & large conferences.', imageUrl: IMG('photo-1519167758481-83f550bb49b8') },
    { id: '2', name: 'Executive Boardroom', capacity: '20 guests', description: 'Private meetings with AV & catering.', imageUrl: IMG('photo-1497366216548-37526070297c') },
    { id: '3', name: 'Garden Pavilion', capacity: '150 guests', description: 'Outdoor celebrations & cocktail events.', imageUrl: IMG('photo-1464366400600-7168b8af9bc3') },
  ],
  experiences: [
    { id: '1', title: 'Curated City Tours', description: 'Discover Mumbai with our concierge-curated itineraries.', imageUrl: IMG('photo-1529253357930-700b725e6200') },
    { id: '2', title: 'Wellness Retreat', description: 'Spa rituals and yoga sessions for complete rejuvenation.', imageUrl: IMG('photo-1540555700478-4be289fbecef') },
    { id: '3', title: 'Culinary Journey', description: 'Chef\'s table and wine pairing experiences.', imageUrl: IMG('photo-1414235077428-338989a2e8c0') },
  ],
  attractions: [
    { id: '1', name: 'Chhatrapati Shivaji Airport', distance: '20 min', type: 'Airport' },
    { id: '2', name: 'Bandra Kurla Complex', distance: '5 min walk', type: 'Business' },
    { id: '3', name: 'Bandra-Worli Sea Link', distance: '15 min', type: 'Landmark' },
    { id: '4', name: 'Phoenix Marketcity', distance: '10 min', type: 'Shopping' },
  ],
  gallery: [
    { id: '1', type: 'image', url: IMG('photo-1566073771259-6a8506099945'), alt: 'Hotel exterior', span: 'wide' },
    { id: '2', type: 'image', url: IMG('photo-1631049307264-da0ec9d70304'), alt: 'Executive room' },
    { id: '3', type: 'image', url: IMG('photo-1414235077428-338989a2e8c0'), alt: 'Restaurant', span: 'tall' },
    { id: '4', type: 'image', url: IMG('photo-1540555700478-4be289fbecef'), alt: 'Spa' },
    { id: '5', type: 'image', url: IMG('photo-1519167758481-83f550bb49b8'), alt: 'Ballroom', span: 'wide' },
    { id: '6', type: 'image', url: IMG('photo-1520250497591-112f2f40a3f4'), alt: 'Lobby' },
  ],
  testimonials: [
    { id: '1', guest: 'Rajesh M.', rating: 5, text: 'Exceptional service and location for business travel. The direct booking rate was unbeatable.', source: 'Google', date: '2025' },
    { id: '2', guest: 'Sarah K.', rating: 5, text: 'A true luxury experience. The dining and spa exceeded our expectations.', source: 'TripAdvisor', date: '2025' },
    { id: '3', guest: 'Amit P.', rating: 5, text: 'Perfect venue for our corporate offsite. Seamless events team.', source: 'Google', date: '2024' },
  ],
  awards: [
    { id: '1', title: 'Best Business Hotel — Mumbai', year: '2025' },
    { id: '2', title: 'Travellers\' Choice Award', year: '2024' },
    { id: '3', title: 'Luxury Hospitality Excellence', year: '2024' },
  ],
  corporate: {
    headline: 'Corporate Travel, Simplified',
    description: 'Dedicated corporate portal, monthly billing, negotiated rates, and priority reservations for your organization.',
    features: [
      { id: '1', title: 'Corporate Pricing', description: 'Volume-based negotiated rates for your company.' },
      { id: '2', title: 'Corporate Portal', description: 'Self-service booking portal for employees.' },
      { id: '3', title: 'Monthly Billing', description: 'Consolidated invoicing and GST compliance.' },
      { id: '4', title: 'Long Stay Packages', description: 'Extended stay rates for project teams.' },
    ],
    ctaLabel: 'Request Corporate Account',
    ctaHref: '/corporate',
  },
  newsletter: {
    headline: 'Exclusive Offers Direct to Your Inbox',
    description: 'Subscribe for member-only rates, seasonal packages, and dining promotions.',
  },
  location: {
    headline: 'Prime Location in BKC',
    description: 'Minutes from the airport, financial district, and Mumbai\'s finest attractions.',
    nearby: [
      { id: '1', name: 'CSIA Airport', distance: '20 min drive', type: 'Airport' },
      { id: '2', name: 'BKC Metro', distance: '8 min walk', type: 'Metro' },
      { id: '3', name: 'Jio World Centre', distance: '10 min', type: 'Business Park' },
      { id: '4', name: 'Gateway of India', distance: '45 min', type: 'Tourist' },
    ],
  },
};
