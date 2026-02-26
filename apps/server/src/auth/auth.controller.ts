import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { NaverAuthGuard } from './guards/naver-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  naverLogin(): void {
    // Passport guard redirects to Naver OAuth.
  }

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  naverCallback(@Req() req: Request) {
    const requestUser = (req as Request & { user?: unknown }).user;
    return this.authService.buildNaverLoginResult(requestUser);
  }
}
