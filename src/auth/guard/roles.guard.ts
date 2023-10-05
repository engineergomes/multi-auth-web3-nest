import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      //If I setup RolesGuard without a role this guard will authorize the user
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return roles.some((role) => user.roles.includes(role));
  }
}
