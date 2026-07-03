import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { GxpRoomDetails, GxpSessionContext } from '@tungaos/shared';

@Injectable()
export class GxpRoomService {
  constructor(private prisma: PrismaService) {}

  async getRoomDetails(session: GxpSessionContext): Promise<GxpRoomDetails> {
    const room = session.roomId
      ? await this.prisma.room.findFirst({
          where: { id: session.roomId, hotelId: session.hotelId },
          include: { roomType: true, floor: true },
        })
      : null;

    const hotel = await this.prisma.hotel.findUnique({
      where: { id: session.hotelId },
      select: { phone: true },
    });

    return {
      roomNumber: session.roomNumber ?? '—',
      roomType: session.roomType ?? room?.roomType.name ?? 'Standard',
      floor: room?.floor?.name ?? null,
      amenities: ['WiFi', 'Smart TV', 'Mini Bar', 'Air Conditioning', 'Safe', 'Coffee Maker'],
      wifiPassword: `Tunga${session.roomNumber ?? 'Guest'}`,
      images: [],
      features: ['King Bed', 'City View', 'Marble Bathroom'],
      emergencyNumbers: [
        { label: 'Front Desk', number: hotel?.phone ?? '0' },
        { label: 'Emergency', number: '112' },
        { label: 'Medical', number: '108' },
      ],
    };
  }
}
