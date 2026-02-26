import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { NaverAuthResult, NaverProfile } from '@ledger/types';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import type { NaverProfileResponse } from '../types/naver-profile.type';

@Injectable()
export class NaverStrategy extends PassportStrategy(OAuth2Strategy, 'naver') {
  constructor(configService: ConfigService) {
    super({
      authorizationURL: 'https://nid.naver.com/oauth2.0/authorize',
      tokenURL: 'https://nid.naver.com/oauth2.0/token',
      clientID: configService.getOrThrow<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('NAVER_CLIENT_SECRET'),
      callbackURL:
        configService.get<string>('NAVER_CALLBACK_URL') ??
        'http://localhost:8000/auth/naver/callback',
      scope: ['name', 'email', 'profile_image'],
      state: true,
    });
  }

  async userProfile(
    accessToken: string,
    done: (error: Error | null, profile?: NaverProfile) => void,
  ): Promise<void> {
    try {
      const response = await fetch('https://openapi.naver.com/v1/nid/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new InternalServerErrorException(
          `Failed to fetch Naver profile: ${response.status}`,
        );
      }

      const data = (await response.json()) as NaverProfileResponse;

      if (data.resultcode !== '00') {
        throw new InternalServerErrorException(
          `Naver profile error: ${data.message}`,
        );
      }

      done(null, {
        id: data.response.id,
        email: data.response.email,
        name: data.response.name,
        profileImage: data.response.profile_image,
      });
    } catch (error) {
      done(error as Error);
    }
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: NaverProfile,
  ): NaverAuthResult {
    return {
      provider: 'naver',
      accessToken,
      refreshToken,
      profile,
    };
  }
}
