import { Injectable } from '@nestjs/common';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

export interface ProcessPaymentInput {
  hotelId: string;
  reservationId: string;
  guestId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  guestEmail: string;
  guestName: string;
  reservationCode: string;
}

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Process payment via configured gateway.
   * Razorpay/Stripe integration point — currently simulates successful capture for direct bookings.
   */
  async processPayment(input: ProcessPaymentInput) {
    const paymentNumber = `PAY-${input.reservationCode}`;

    const isCash = input.method === 'CASH';
    const status: PaymentStatus = isCash ? PaymentStatus.PENDING : PaymentStatus.CAPTURED;
    const paidAmount = isCash ? 0 : input.amount;

    const payment = await this.prisma.payment.create({
      data: {
        hotelId: input.hotelId,
        guestId: input.guestId,
        reservationId: input.reservationId,
        paymentNumber,
        amount: input.amount,
        currency: input.currency,
        method: input.method,
        status,
        gatewayRef: this.generateGatewayRef(input.method),
        gatewayData: {
          provider: input.method === 'RAZORPAY' ? 'razorpay' : input.method === 'STRIPE' ? 'stripe' : 'internal',
          simulated: true,
        },
        paidAt: status === PaymentStatus.CAPTURED ? new Date() : null,
        notes: isCash ? 'Pay at hotel' : 'Online payment',
      },
    });

    return {
      paymentId: payment.id,
      paymentNumber: payment.paymentNumber,
      status: payment.status,
      paidAmount,
      gatewayRef: payment.gatewayRef,
      /** Razorpay order ID for frontend checkout — wire to Razorpay SDK */
      razorpayOrderId: input.method === 'RAZORPAY' ? `order_${payment.id.slice(0, 8)}` : undefined,
    };
  }

  async createPaymentIntent(hotelId: string, reservationId: string, amount: number, method: PaymentMethod) {
    return {
      intentId: `pi_${reservationId.slice(0, 8)}`,
      amount: amount * 100,
      currency: 'INR',
      method,
      clientSecret: `secret_${reservationId.slice(0, 12)}`,
    };
  }

  private generateGatewayRef(method: PaymentMethod) {
    const prefix = method === 'RAZORPAY' ? 'rzp' : method === 'STRIPE' ? 'pi' : 'txn';
    return `${prefix}_${Date.now()}`;
  }
}
