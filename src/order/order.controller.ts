import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Prisma, Order, Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { Roles } from 'src/auth/auth.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  create(@Body() data: { itemId: string[] }, @Request() req): Promise<{ status: boolean, message: string, data: object }> {
    return this.orderService.create(data.itemId, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  findAll(@Request() req): Promise<{ status: boolean, message: string, data: object }> {
    return this.orderService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string, @Request() req) {
    return this.orderService.findOne(id, req.user.id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
