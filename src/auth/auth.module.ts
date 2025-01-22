import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokensService } from './tokens/tokens.service';
import { UsersModule } from 'src/users/users.module';
import { Auth, AuthSchema } from './auth.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { BasicStrategy } from './basic.strategy';
import { ConfigsModule } from 'src/configs/configs.module';
import { PermissionsModule } from 'src/core/permissions/permissions.module';
import { UtilsService } from 'src/core/utils/utils.service';

@Module({
  imports: [
    UsersModule,
    PermissionsModule,
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '1d' },
      }),
      inject: [ConfigService],
    }),
    ConfigsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService, JwtStrategy, BasicStrategy, UtilsService],
})
export class AuthModule {}
