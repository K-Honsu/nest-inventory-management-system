import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { PrismaService } from 'src/prisma.service';
import { omit } from 'lodash';


@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) { }
  async login(data: LoginDto): Promise<{ user: object, status: boolean, message: string, token: string }> {
    const { email, password } = data
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (!user) throw new UnauthorizedException("User does not exist")
    const isMatchedPassword = await bcrypt.compare(password, user.password)
    if (!isMatchedPassword) throw new UnauthorizedException("Invalid Email or Password")
    const token = this.jwtService.sign({ id: user.id, role: user.role })
    const userWithoutPassword = omit(user, 'password');
    return { status: true, message: "Login successfully", user : userWithoutPassword, token }
  }
}
