import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { Auth } from './auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import STRINGS from 'src/common/consts/strings.json';
import { UsersService } from 'src/core/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  hash(string: string) {
    return bcrypt.hashSync(string, 10);
  }

  compare(string: string, hash: string) {
    return bcrypt.compareSync(string, hash);
  }

  async validateUser({
    username,
    password,
    client,
  }: {
    username: string;
    password: string;
    client: string;
  }) {
    const user = await this.usersService.findOneByFilter({
      username: username,
      client: client,
    });
    if (!user) throw Error(STRINGS.RESPONSES.USER_NOT_FOUND);
    const auth = await this.findOneByFilter({
      userId: user._id,
    });
    if (!auth) throw Error(STRINGS.RESPONSES.USER_NOT_FOUND);
    const isValid = this.compare(password, auth.password);
    if (!isValid) throw Error(STRINGS.RESPONSES.INVALID_PASSWORD);
    return user;
  }

  async login(userId: string) {
    return {
      access_token: this.jwtService.sign({
        userId: userId,
      }),
    };
  }
  create(dto: Auth) {
    return this.authModel.create({
      userId: dto.userId,
      password: this.hash(dto.password),
      client: dto.client,
    });
  }

  findOneByFilter(filter: FilterQuery<Auth>) {
    return this.authModel.findOne(filter).lean();
  }
}
