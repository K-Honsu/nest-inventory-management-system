import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Item, Category } from '@prisma/client';
import { omit } from 'lodash';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: Prisma.ItemCreateInput, userId: string): Promise<{ item: Item, status: boolean, message: string }> {
    const createdItem = await this.prisma.item.create({
      data: {
        ...data,
        User: { connect: { id: userId } },
        category: { connect: { id: String(data.category) } }
      }
    });
    return { status: true, message: "Item created successfully", item: createdItem }
  }

  async findAll(): Promise<{ status: boolean, message: string, data: object }> {
    const items = await this.prisma.item.findMany({
      include: {
        User: true,
        OrderItem: true,
        category: true
      }
    })

    const itemWithoutpassword = items.map(item => ({
      ...item,
      User: item.User ? omit(item.User, "password") : null
    }))
    return { status: true, message: "Items successfully retreived", data: itemWithoutpassword }
  }

  async findOne(id: string): Promise<{ status: boolean, message: string, data: object }> {
    const item = await this.prisma.item.findUnique({
      where: { id: id },
      include: {
        User: true,
        OrderItem: true
      }
    })

    if (!item) throw new UnauthorizedException("Item not found")
    const itemWithoutpassword = omit(item, "User.password")

    return { status: true, message: "Item gotten", data: itemWithoutpassword }
  }

  async update(id: string, data: Prisma.ItemUpdateInput): Promise<{ status: boolean, message: string, item: object }> {
    const { name, price, size } = data
    const item = await this.prisma.item.findUnique({
      where: {
        id: id
      }
    })
    if (!item) throw new UnauthorizedException("Item does not exist")
    const updatedItem = await this.prisma.item.update({
      where: { id: id }, data: {
        name,
        price,
        size,
        category: { connect: { id: String(data.category) } }
      }
    })
    return { status: true, message: "Item updated successfully", item: updatedItem }
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
