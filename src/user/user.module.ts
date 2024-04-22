import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
    imports : [PassportModule.register({ defaultStrategy: "jwt" }),],
  // exports : [PrismaService],
  providers: [UserService, PrismaService, JwtService],
})
export class UserModule { }
