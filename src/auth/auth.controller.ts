import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  login(@Body() data: LoginDto):Promise<{user : object, status : boolean, message : string, token: string}> {
    return this.authService.login(data);
  }
}
