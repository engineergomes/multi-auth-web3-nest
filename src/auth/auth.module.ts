import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { JwtStrategy, DiscordStrategy, TwitterStrategy } from './strategy';
import { SessionSerializer } from './session-serializer';
import { WalletStrategy } from './strategy/wallet.strategy';

@Module({
  imports: [JwtModule.register({}), PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    DiscordStrategy,
    TwitterStrategy,
    WalletStrategy,
    SessionSerializer,
    UsersService,
  ],
})
export class AuthModule {}
