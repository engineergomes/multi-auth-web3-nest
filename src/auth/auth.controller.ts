import {
  Controller,
  Get,
  Redirect,
  Req,
  Res,
  UseGuards,
  Post,
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
export class AuthController {
  constructor(private config: ConfigService) {}

  @Post('/wallet')
  @UseGuards(WalletAuthGuard)
  walletLogin() {
    return;
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordLogin() {
    return;
  }

  @Get('discord/callback')
  @UseGuards(DiscordAuthGuard)
  @Redirect('http://localhost:3000/dashboard')
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
    res.redirect('http://localhost:3000/dashboard');
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
