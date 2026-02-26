import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { NaverAuthResult } from '@ledger/types';

@Injectable()
export class AuthService {
  buildNaverLoginResult(user: unknown): NaverAuthResult {
    if (!user || typeof user !== 'object') {
      throw new UnauthorizedException('Naver authentication failed');
    }

    return user as NaverAuthResult;
  }
}
