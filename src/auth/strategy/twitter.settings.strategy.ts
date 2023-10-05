import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';
import { TwitterService } from 'src/twitter/twitter.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TwitterSettingsStrategy extends PassportStrategy(
  Strategy,
  'twitterSettings',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
    private twitterService: TwitterService,
    private usersService: UsersService,
  ) {
    super({
      consumerKey: config.get('TWITTER_CONSUMER_KEY'),
      consumerSecret: config.get('TWITTER_CONSUMER_SECRET'),
      callbackURL: `${config.get('BASE_URL')}/auth/twitter/callback/settings`,
      includeEmail: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, profile_image_url, screen_name, id_str } = profile._json;

    const accessTokenExpiry = new Date();

    accessTokenExpiry.setSeconds(accessTokenExpiry.getSeconds() + 7200);

    return {
      name,
      profileImageUrl: profile_image_url,
      username: screen_name,
      id: id_str,
      refreshToken,
      accessToken,
      accessTokenExpiry,
    };
  }
}
