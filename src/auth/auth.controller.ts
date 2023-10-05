import {
  Controller,
  Get,
  Redirect,
  Req,
  Res,
  UseGuards,
  Post,
  Session,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

import {
  AuthenticatedGuard,
  WalletAuthGuard,
  TwitterAuthGuard,
  DiscordAuthGuard,
} from './guard';

@Controller('auth')
export class AuthCrontroler {
  constructor(private config: ConfigService) {}

  @Post('/wallet')
  @UseGuards(WalletAuthGuard)
  walletLogin(@Req() req, @Session() session) {
    return;
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordLogin() {
    return;
  }

  @Get('discord/callback')
  @UseGuards(DiscordAuthGuard)
  @Redirect(this.config.get('FRONT_URL') + '/welcome')
  async discordLoginCallback() {
    return;
  }

  @Get('twitter')
  @UseGuards(AuthGuard('twitter'))
  twitterLogin() {
    return;
  }

  @Get('twitter/callback')
  @UseGuards(TwitterAuthGuard)
  twitterLoginCallback(@Req() req, @Res() res) {
    res.redirect(this.config.get('FRONT_URL') + '/welcome');
    return;
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req, @Res() res) {
    req.logout(() => {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            res.json({ message: 'Unable to log out' });
          } else {
            res.clearCookie('connect.sid');
            res.end();
          }
        });
      } else {
        res.end();
      }
    });
  }
}
