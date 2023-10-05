import * as bs58 from 'bs58';
import * as nacl from 'tweetnacl';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WalletStrategy extends PassportStrategy(Strategy, 'wallet') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super();
  }

  async validate(
    publicKey: string,
    signature: string,
    done: (err: any, user?: any) => void,
  ): Promise<any> {
    const message = 'Hello, world!';
    const messageBytes = new TextEncoder().encode(message);
    const publicKeyBytes = bs58.decode(publicKey);
    const signatureBytes = bs58.decode(signature);

    const result = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes,
    );

    if (!result) {
      throw new UnauthorizedException('User can not be authenticated');
    }

    try {
      // check if there's a wallet with this public key
      const wallet = await this.prisma.wallet.findUnique({
        where: { publicKey },
      });

      if (wallet) {
        const user = await this.prisma.user.findUnique({
          where: { id: wallet.userId },
          include: { discord: true, wallets: true, twitter: true },
        });

        return done(null, user);
      }

      // If not a user, create a user profile
      const newUser = await this.prisma.user.create({
        data: {
          name: publicKey,
          wallets: {
            create: {
              publicKey,
            },
          },
        },
        include: { discord: true, wallets: true, twitter: true },
      });

      return done(null, newUser);
    } catch (error) {
      throw new UnauthorizedException('User can not be authenticated');
    }
  }
}
