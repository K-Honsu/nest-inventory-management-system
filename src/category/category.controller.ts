import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category, Prisma, Role } from "@prisma/client"
import { Roles } from "../auth/auth.decorator"
import { AuthGuard } from 'src/common/guards/auth.guards';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  create(@Body() data: Prisma.CategoryCreateInput, @Request() req): Promise<{ createdCAtegory: Category, status: boolean, message: string }> {

    if (req.user.role !== Role.ADMIN) throw new UnauthorizedException("You do not have permission to create this resource")
    return this.categoryService.create(data);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() data: Prisma.CategoryUpdateInput, @Request() req) {
    if (req.user.role !== Role.ADMIN) throw new UnauthorizedException("You do not have permission to create this resource")
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req): Promise<{ status: boolean, message: string }> {
    if (req.user.role !== Role.ADMIN) throw new UnauthorizedException("You do not have permission to create this resource")
    return this.categoryService.remove(id);
  }
}
