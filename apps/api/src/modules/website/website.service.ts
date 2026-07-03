import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

@Injectable()
export class WebsiteService {
  constructor(private prisma: PrismaService) {}

  async getHotelBySlug(slug: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug, deletedAt: null, isActive: true },
      select: { id: true, slug: true, name: true, logoUrl: true },
    });
    if (!hotel) throw new NotFoundException(`Hotel not found: ${slug}`);
    return hotel;
  }

  async getPublicContent(hotelId: string) {
    const [settings, heroSlides, rooms, offers, gallery, testimonials, menus] = await Promise.all([
      this.prisma.cmsWebsiteSettings.findUnique({ where: { hotelId } }),
      this.prisma.cmsHeroSlide.findMany({
        where: { hotelId, status: 'PUBLISHED', deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.cmsWebsiteRoom.findMany({
        where: { hotelId, status: 'PUBLISHED', deletedAt: null },
        orderBy: { sortOrder: 'asc' },
        include: { seo: true },
      }),
      this.prisma.cmsOffer.findMany({
        where: { hotelId, status: 'PUBLISHED', deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.cmsGalleryItem.findMany({
        where: { hotelId, status: 'PUBLISHED', deletedAt: null },
        orderBy: { sortOrder: 'asc' },
        take: 50,
      }),
      this.prisma.cmsTestimonial.findMany({
        where: { hotelId, status: 'PUBLISHED', deletedAt: null },
        orderBy: { sortOrder: 'asc' },
        take: 20,
      }),
      this.prisma.cmsMenu.findMany({
        where: { hotelId, isActive: true },
      }),
    ]);

    return {
      settings: settings ?? {},
      hero: heroSlides,
      rooms,
      offers,
      gallery,
      testimonials,
      menus,
    };
  }

  async getCmsDashboard(hotelId: string) {
    const [pages, drafts, rooms, offers, gallery, testimonials, blogPosts] = await Promise.all([
      this.prisma.cmsPage.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.cmsPage.count({ where: { hotelId, status: 'DRAFT', deletedAt: null } }),
      this.prisma.cmsWebsiteRoom.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.cmsOffer.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.cmsGalleryItem.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.cmsTestimonial.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.cmsBlogPost.count({ where: { hotelId, deletedAt: null } }),
    ]);

    return { pages, drafts, rooms, offers, gallery, testimonials, blogPosts };
  }

  async listCmsSection(hotelId: string, section: string) {
    switch (section) {
      case 'hero':
        return this.prisma.cmsHeroSlide.findMany({
          where: { hotelId, deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        });
      case 'rooms':
        return this.prisma.cmsWebsiteRoom.findMany({
          where: { hotelId, deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        });
      case 'offers':
        return this.prisma.cmsOffer.findMany({
          where: { hotelId, deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        });
      case 'gallery':
        return this.prisma.cmsGalleryItem.findMany({
          where: { hotelId, deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        });
      case 'testimonials':
        return this.prisma.cmsTestimonial.findMany({
          where: { hotelId, deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        });
      case 'blog':
        return this.prisma.cmsBlogPost.findMany({
          where: { hotelId, deletedAt: null },
          orderBy: { updatedAt: 'desc' },
        });
      case 'media':
        return this.prisma.cmsMediaFile.findMany({
          where: { hotelId, deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 100,
        });
      default:
        return this.prisma.cmsPage.findMany({
          where: { hotelId, pageType: section, deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        });
    }
  }
}
