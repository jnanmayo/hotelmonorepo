/** Public marketing site routes (no /app prefix) */
export const PUBLIC_ROUTES = {
  home: '/',
  rooms: '/rooms',
  dining: '/dining',
  meetingsEvents: '/meetings-events',
  corporate: '/corporate',
  offers: '/offers',
  gallery: '/gallery',
  amenities: '/amenities',
  experiences: '/experiences',
  about: '/about',
  contact: '/contact',
  location: '/location',
  book: '/book',
  stayScan: '/stay/scan',
  bookSearch: '/book/search',
  bookCheckout: '/book/checkout',
  bookPayment: '/book/payment',
  privacy: '/privacy',
  terms: '/terms',
  careers: '/careers',
  /** @deprecated use amenities */
  facilities: '/facilities',
  /** @deprecated use location */
  explore: '/explore',
} as const;

export const ERROR_ROUTES = {
  unauthorized: '/unauthorized',
  accessDenied: '/access-denied',
  sessionExpired: '/session-expired',
  subscriptionExpired: '/subscription-expired',
} as const;

export const AUTH_ROUTES = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  otp: '/otp',
  chooseHotel: '/choose-hotel',
  chooseRole: '/choose-role',
  oauthCallback: '/oauth/callback',
} as const;

export const AUTH_PATH_PREFIXES = [
  AUTH_ROUTES.login,
  AUTH_ROUTES.register,
  AUTH_ROUTES.forgotPassword,
  AUTH_ROUTES.resetPassword,
  AUTH_ROUTES.verifyEmail,
  AUTH_ROUTES.otp,
  AUTH_ROUTES.chooseHotel,
  AUTH_ROUTES.chooseRole,
  AUTH_ROUTES.oauthCallback,
] as const;

export const APP_ROUTES = {
  dashboard: '/app/dashboard',
} as const;

export interface NavLink {
  key: string;
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { key: 'home', label: 'Home', href: PUBLIC_ROUTES.home },
  { key: 'rooms', label: 'Rooms & Suites', href: PUBLIC_ROUTES.rooms },
  { key: 'dining', label: 'Dining', href: PUBLIC_ROUTES.dining },
  { key: 'meetings', label: 'Meetings & Events', href: PUBLIC_ROUTES.meetingsEvents },
  { key: 'corporate', label: 'Corporate', href: PUBLIC_ROUTES.corporate },
  { key: 'offers', label: 'Special Offers', href: PUBLIC_ROUTES.offers },
  { key: 'gallery', label: 'Gallery', href: PUBLIC_ROUTES.gallery },
  { key: 'amenities', label: 'Amenities', href: PUBLIC_ROUTES.amenities },
  { key: 'experiences', label: 'Experiences', href: PUBLIC_ROUTES.experiences },
  { key: 'about', label: 'About Us', href: PUBLIC_ROUTES.about },
  { key: 'contact', label: 'Contact', href: PUBLIC_ROUTES.contact },
  { key: 'location', label: 'Location', href: PUBLIC_ROUTES.location },
];

export const FOOTER_LINKS = {
  rooms: [
    { label: 'Executive Room', href: PUBLIC_ROUTES.rooms },
    { label: 'Deluxe Suite', href: PUBLIC_ROUTES.rooms },
    { label: 'Presidential Suite', href: PUBLIC_ROUTES.rooms },
  ],
  dining: [
    { label: 'Restaurant', href: PUBLIC_ROUTES.dining },
    { label: 'Bar & Lounge', href: PUBLIC_ROUTES.dining },
    { label: 'Reserve a Table', href: PUBLIC_ROUTES.dining },
  ],
  corporate: [
    { label: 'Corporate Booking', href: PUBLIC_ROUTES.corporate },
    { label: 'Meetings & Events', href: PUBLIC_ROUTES.meetingsEvents },
    { label: 'Request Account', href: PUBLIC_ROUTES.corporate },
  ],
  legal: [
    { label: 'Privacy Policy', href: PUBLIC_ROUTES.privacy },
    { label: 'Terms of Service', href: PUBLIC_ROUTES.terms },
    { label: 'Careers', href: PUBLIC_ROUTES.careers },
  ],
};
