import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthCrontroler } from './auth.controller';
import { JwtStrategy, DiscordStrategy, TwitterStrategy } from './strategy';
import { WalletStrategy } from './strategy/wallet.strategy';
import { TwitterSettingsStrategy } from './strategy/twitter.settings.strategy';

@Module({
  imports: [JwtModule.register({}), PassportModule.register({ session: true })],
  controllers: [AuthCrontroler],
  providers: [
    JwtStrategy,
    DiscordStrategy,
    TwitterStrategy,
    TwitterSettingsStrategy,
    WalletStrategy,
  ],
})
export class AuthModule {}
