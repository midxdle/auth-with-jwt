import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { CurrentUser } from 'src/user/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body('LoginAuthDto') loginAuthDto: LoginAuthDto) {
    const user = await this.userService.validateUser(loginAuthDto);
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  getUser(@CurrentUser() user) {
    return this.authService.validateUser(user);
  }
}
