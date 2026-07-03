import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@/common/decorators/auth.decorators';
import { WebsiteService } from '@/modules/website/website.service';

@ApiTags('Public Website')
@Controller('public/website')
export class PublicWebsiteController {
  constructor(private websiteService: WebsiteService) {}

  @Public()
  @Get()
  async getContent(@Query('hotelSlug') hotelSlug = 'tunga-international') {
    const hotel = await this.websiteService.getHotelBySlug(hotelSlug);
    const content = await this.websiteService.getPublicContent(hotel.id);
    return { data: { hotel, ...content } };
  }

  @Public()
  @Get('rooms')
  async getRooms(@Query('hotelSlug') hotelSlug = 'tunga-international') {
    const hotel = await this.websiteService.getHotelBySlug(hotelSlug);
    const content = await this.websiteService.getPublicContent(hotel.id);
    return { data: content.rooms };
  }

  @Public()
  @Get('offers')
  async getOffers(@Query('hotelSlug') hotelSlug = 'tunga-international') {
    const hotel = await this.websiteService.getHotelBySlug(hotelSlug);
    const content = await this.websiteService.getPublicContent(hotel.id);
    return { data: content.offers };
  }

  @Public()
  @Get('gallery')
  async getGallery(@Query('hotelSlug') hotelSlug = 'tunga-international') {
    const hotel = await this.websiteService.getHotelBySlug(hotelSlug);
    const content = await this.websiteService.getPublicContent(hotel.id);
    return { data: content.gallery };
  }
}
