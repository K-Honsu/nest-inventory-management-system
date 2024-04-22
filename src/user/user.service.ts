import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcrypt"
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }
  async createAdmin(data: Prisma.UserCreateInput): Promise<{ user: User, status: boolean, message: string }> {
    const { first_name, last_name, email, gender, password } = data
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const user = await this.prisma.user.create({
        data: {
          first_name,
          last_name,
          email,
          role: Role.ADMIN,
          gender,
          password: hashedPassword,
        }
      });

      return { status: true, message: "User Profile Created Successfully", user };
    } catch (error) {
      return { status: false, message: "Failed to create user profile", user: null };
    }
  }

  async createCustomer(data: Prisma.UserCreateInput): Promise<{ user: User, status: boolean, message: string }> {
    const { first_name, last_name, email, gender, password } = data
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const user = await this.prisma.user.create({
        data: {
          first_name,
          last_name,
          email,
          role: Role.CUSTOMER,
          gender,
          password: hashedPassword,
        }
      });

      return { status: true, message: "User Profile Created Successfully", user };
    } catch (error) {
      return { status: false, message: "Failed to create user profile", user: null };
    }
  }

  async getInfo(id: string): Promise<{ user: object, status: boolean, message: string }> {
    try {

      const foundUser = await this.prisma.user.findUnique({
        where: {
          id: id
        }
      })

      if (!foundUser) throw new UnauthorizedException("User does not exist")
      const userWithoutPassword = omit(foundUser, 'password');
      return { status: true, message: "User details gotten successfully", user: userWithoutPassword };

    } catch (error) {
      console.log("Error Occured:", error)
      return { status: false, message: error.message, user: null };
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
