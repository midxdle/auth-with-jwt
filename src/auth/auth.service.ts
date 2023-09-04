import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { PayloadAuthDto } from './dto/payload-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userSerivce: UserService,
  ) {}

  async login(user: User) {
    const payload = { username: user.username, sub: user.uuid };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(payload: PayloadAuthDto): Promise<User> {
    return this.userSerivce.findByUsername(payload.username);
  }
}
