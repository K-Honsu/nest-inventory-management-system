import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Order, Prisma, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) { }
  async create(itemIds: string[], userId: string): Promise<{ status: boolean, message: string, data: Order }> {
    const totalPrice = await this.calculateTotalPrice(itemIds)

    const order = await this.prisma.order.create({
      data: {
        payment_status: PaymentStatus.PENDING,
        User: { connect: { id: userId } },
        totalPrice,
        OrderItem: {
          createMany: { data: itemIds.map(itemId => ({ itemId })) }
        }
      },
      include: {
        OrderItem: true
      }
    })
    return { status: true, message: "Order created successfully", data: order }
  }
  private async calculateTotalPrice(itemIds: string[]): Promise<number> {
    let totalPrice = 0;
    for (const itemId of itemIds) {
      const item = await this.prisma.item.findUnique({
        where: { id: String(itemId) },
        select: { price: true }
      })
      if (item) {
        totalPrice += item.price
      }
    }
    return totalPrice
  }

  async findAll(userId: string): Promise<{ status: boolean, message: string, data: object }> {
    const orders = await this.prisma.order.findMany({
      where: { id: userId },
      include: {
        OrderItem: true
      }
    })
    return { status: true, message: "Order gottens", data: orders }
  }

  async findOne(id: string, userId: string): Promise<{ status: boolean, message: string, data: object }> {
    const order = await this.prisma.order.findUnique({
      where: { id: id, userId: userId },
      include: {
        OrderItem: true
      }
    })
    if (!order) {
      throw new NotFoundException({ status: false, message: "Order not found" })
    }
    return { status: true, message: "Order found", data: order }
  }

  update(id: number, updateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
