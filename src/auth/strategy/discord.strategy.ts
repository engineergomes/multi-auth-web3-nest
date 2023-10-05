import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      clientID: config.get('DISCORD_CLIENT_ID'),
      clientSecret: config.get('DISCORD_CLIENT_SECRET'),
      callbackURL: `${config.get('BASE_URL')}/auth/discord/callback`,
      scope: ['identify'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void,
  ) {
    try {
      //check if theres a discord user
      const discordUser = await this.prisma.discord.findUnique({
        where: { id: profile.id },
      });

      if (discordUser) {
        const user = await this.prisma.user.findUnique({
          where: { id: discordUser.userId },
          include: { discord: true, matrica: true, twitter: true, nfts: true },
        });

        return done(null, user);
      }

      //If not a user get Discord user profile and create a new user

      const user = await this.prisma.user.create({
        data: {
          name: profile.username,
          discord: { create: { refreshToken, ...profile } },
        },
        include: { discord: true, matrica: true, twitter: true, nfts: true },
      });
      return done(null, user);
    } catch (error) {
      throw error;
    }
  }
}
