import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { TwitterService } from 'src/twitter/twitter.service';
import { Client } from 'twitter-api-sdk';

@Injectable()
export class TwitterAuthenticatedGuard implements CanActivate {
  constructor(private twitterService: TwitterService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return this.twitterService.checkTwitterAccessToken(request.user.twitter);
  }
}
