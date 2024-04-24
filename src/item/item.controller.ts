import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ItemService } from './item.service';
import { PrismaService } from 'src/prisma.service';
import { Roles } from 'src/auth/auth.decorator';
import { Prisma, Item, Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guards';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService, private prisma: PrismaService) { }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  create(@Body() data: Prisma.ItemCreateInput, @Request() req): Promise<{ item: object, status: boolean, message: string }> {
    console.log(req.user)
    return this.itemService.create(data, req.user.id);
  }

  @Get()
  findAll(): Promise<{ status: boolean, message: string, data: object }> {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<{ status: boolean, message: string, data: object }> {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ItemUpdateInput): Promise<{ status: boolean, message: string, item: object }> {
    return this.itemService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
