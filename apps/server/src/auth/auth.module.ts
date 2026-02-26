import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NaverStrategy } from './strategies/naver.strategy';

@Module({
  imports: [
    PassportModule.register({
      session: false,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, NaverStrategy],
})
export class AuthModule {}
