import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User, Prisma } from "@prisma/client"
import { AuthGuard } from 'src/common/guards/auth.guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("admin")
  create(@Body() data: Prisma.UserCreateInput): Promise<{ user: User, status: boolean, message: string }> {
    return this.userService.createAdmin(data);
  }

  @Post("customer")
  customer(@Body() data: Prisma.UserCreateInput): Promise<{ user: User, status: boolean, message: string }> {
    return this.userService.createCustomer(data)
  }

  @UseGuards(AuthGuard)
  @Get("user-details")
  getInfomation(@Request() req): Promise<{ user: object, status: boolean, message: string }> {
    return this.userService.getInfo(req.user.id)
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
