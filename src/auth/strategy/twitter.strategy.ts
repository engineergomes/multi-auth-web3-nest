import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '@superfaceai/passport-twitter-oauth2';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      clientID: config.get('TWITTER_CLIENT_ID'),
      clientSecret: config.get('TWITTER_CLIENT_SECRET'),
      clientType: 'confidential',
      callbackURL: `${config.get('BASE_URL')}/auth/twitter/callback`,
      scope: ['tweet.read', 'users.read', 'offline.access', 'like.read'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { name, profile_image_url, username, id } = profile._json;
    try {
      // check if theres a twitter user
      const twitterUser = await this.prisma.twitter.findUnique({
        where: { id: id },
      });

      if (twitterUser) {
        const user = await this.prisma.user.findUnique({
          where: {
            id: twitterUser.userId,
          },
          include: { discord: true, twitter: true, wallets: true },
        });

        return user;
      }

      //If not a user create user profile

      const newUser = await this.prisma.user.create({
        data: {
          name: name,
          twitter: {
            create: {
              name,
              profileImageUrl: profile_image_url,
              username,
              id,
              accessToken,
              refreshToken,
            },
          },
        },
        include: { discord: true, twitter: true, wallets: true },
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
