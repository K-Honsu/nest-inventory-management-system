import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Category } from "@prisma/client"

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }
  async create(data: Prisma.CategoryCreateInput): Promise<{ createdCAtegory: Category, status: boolean, message: string }> {
    const { name } = data

    const foundCategory = await this.prisma.category.findFirst({
      where: {
        name: name
      }
    })
    if (foundCategory) throw new UnauthorizedException("Category name already taken, Kindly choose another name.")
    const createdCAtegory = await this.prisma.category.create({
      data
    })
    return { status: true, message: "Category created successfully", createdCAtegory }
  }

  async findAll(): Promise<{ category: object, status: boolean, message: string }> {
    const data = await this.prisma.category.findMany()
    return { status: true, message: "Category List gotten", category: data }
  }

  async findOne(id: string): Promise<{ category: object, status: boolean, message: string }> {
    const data = await this.prisma.category.findUnique({
      where: {
        id: id
      }
    })
    if (!data) throw new UnauthorizedException("Category not found")
    return { status: true, message: "Category gotten", category: data }
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<{ category: object, status: boolean, message: string }> {
    const { name } = data
    const foundCategory = await this.prisma.category.findUnique({
      where: {
        id: id
      }
    })
    if (!foundCategory) throw new UnauthorizedException("Category not found")
    const updatedCategory = await this.prisma.category.update({
      where: {
        id: id
      },
      data: {
        name: name
      }
    })
    return { status: true, message: "Category updated successfully", category: updatedCategory }
  }

  async remove(id: string): Promise<{ status: boolean, message: string }> {
    const foundCategory = await this.prisma.category.delete({
      where: {
        id: id
      }
    })
    if (!foundCategory) throw new UnauthorizedException("Category not found")
    return { status: true, message: "Category deleted successfully." }
  }
}
