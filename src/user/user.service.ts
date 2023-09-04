import { ConflictException } from '@nestjs/common/exceptions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;

    return this.userRepository.save(user);
  }

  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ username });
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const username = createUserDto.username;
    const existingUser = await this.userRepository.findOneByOrFail({
      username,
    });

    if (existingUser) {
      throw new ConflictException('Username already exists.');
    }

    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;

    return this.userRepository.save(user);
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const username = loginUserDto.username;
    const user = await this.userRepository.findOneByOrFail({
      username,
    });

    if (!user || user.password !== loginUserDto.password) {
      throw new ConflictException('Password is invalid');
    }

    return user;
  }
}
