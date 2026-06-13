import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload), user: { id: user.id, email: user.email, role: user.role, name: user.name } };
  }

  async seedAdmin() {
    const existing = await this.userRepo.findOne({ where: { email: 'admin@winajes.com' } });
    if (existing) return;
    const hashed = await bcrypt.hash('admin123', 10);
    await this.userRepo.save(this.userRepo.create({
      email: 'admin@winajes.com',
      password: hashed,
      role: 'admin',
      name: 'Admin',
    }));
  }
}
