import { Body, Controller, Get, Headers, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@/common/decorators/auth.decorators';
import { GXP_SESSION_HEADER, GxpSession, GxpSessionGuard } from '@/modules/gxp/guards/gxp-session.guard';
import { GxpChatService } from '@/modules/gxp/services/gxp-chat.service';
import { GxpDashboardService } from '@/modules/gxp/services/gxp-dashboard.service';
import { GxpDiningService } from '@/modules/gxp/services/gxp-dining.service';
import { GxpFolioService } from '@/modules/gxp/services/gxp-folio.service';
import { GxpRequestService } from '@/modules/gxp/services/gxp-request.service';
import { GxpRoomService } from '@/modules/gxp/services/gxp-room.service';
import { GxpSessionService } from '@/modules/gxp/services/gxp-session.service';

import type {
  GxpChatDepartment,
  GxpChatMessageSchema,
  GxpCheckoutRequestSchema,
  GxpCreateRequestSchema,
  GxpFoodOrderSchema,
  GxpSessionContext,
  GxpSessionSchema,
} from '@tungaos/shared';

@ApiTags('Guest Portal (Public)')
@Controller('public/gxp')
export class PublicGxpController {
  constructor(
    private sessions: GxpSessionService,
    private dashboard: GxpDashboardService,
    private room: GxpRoomService,
    private requests: GxpRequestService,
    private folio: GxpFolioService,
    private dining: GxpDiningService,
    private chat: GxpChatService,
  ) {}

  @Public()
  @Post('session')
  async createSession(@Body() body: GxpSessionSchema) {
    const session = await this.sessions.createSession(body);
    return { data: session };
  }

  @Public()
  @Get('session/validate')
  async validateSession(@Headers(GXP_SESSION_HEADER) token: string) {
    const session = await this.sessions.validateSession(token);
    return { data: session };
  }

  @Public()
  @UseGuards(GxpSessionGuard)
  @Get('dashboard')
  async getDashboard(@GxpSession() session: GxpSessionContext) {
    return { data: await this.dashboard.getDashboard(session) };
  }

  @Public()
  @UseGuards(GxpSessionGuard)
  @Get('room')
  async getRoom(@GxpSession() session: GxpSessionContext) {
    return { data: await this.room.getRoomDetails(session) };
  }

  @Public()
  @UseGuards(GxpSessionGuard)
  @Get('requests')
  async listRequests(@GxpSession() session: GxpSessionContext) {
    return { data: await this.requests.listRequests(session) };
  }

  @Public()
  @UseGuards(GxpSessionGuard)
  @Post('requests')
  async createRequest(@GxpSession() session: GxpSessionContext, @Body() body: GxpCreateRequestSchema) {
    return { data: await this.requests.createRequest(session, body) };
  }

  @Public()
  @UseGuards(GxpSessionGuard)
  @Get('folio')
  async getFolio(@GxpSession() session: GxpSessionContext) {
    return { data: await this.folio.getFolio(session) };
  }

  @Public()
  @UseGuards(GxpSessionGuard)
  @Post('checkout')
  async checkout(@GxpSession() session: GxpSessionContext, @Body() body: GxpCheckoutRequestSchema) {
    return { data: await this.folio.requestCheckout(session, body) };
  }

  @Public()
  @UseGuards(GxpSessionGuard)
  @Get('menu')
  async getMenu(@GxpSession() session: GxpSessionContext) {
    return { data: await this.dining.getMenu(session.hotelId) };
  }

  @Public()
  @UseGuards(GxpSessionGuard)
  @Post('orders')
  async placeOrder(@GxpSession() session: GxpSessionContext, @Body() body: GxpFoodOrderSchema) {
    return { data: await this.dining.placeOrder(session, body) };
  }

  @Public()
  @UseGuards(GxpSessionGuard)
  @Get('chat')
  async listChat(
    @GxpSession() session: GxpSessionContext,
    @Query('department') department?: GxpChatDepartment,
  ) {
    return { data: await this.chat.listMessages(session, department) };
  }

  @Public()
  @UseGuards(GxpSessionGuard)
  @Post('chat')
  async sendChat(@GxpSession() session: GxpSessionContext, @Body() body: GxpChatMessageSchema) {
    return { data: await this.chat.sendMessage(session, body) };
  }
}
