import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigsService } from 'src/configs/configs.service';
import { VisibilityType } from 'src/configs/configs.schema';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configsService: ConfigsService) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    const CLIENT = await this.configsService.get(
      'CLIENT',
      VisibilityType.PRIVATE,
    );

    if (
      CLIENT.subConfigs.AUTH &&
      CLIENT.subConfigs.AUTH[username] &&
      CLIENT.subConfigs.AUTH[username] === password
    ) {
      return username;
    }
    return null;
  }
}
