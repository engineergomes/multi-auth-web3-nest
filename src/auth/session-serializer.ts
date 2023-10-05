import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UsersService) {
    super();
  }
  async serializeUser(
    user: User,
    done: (err: Error, User: User['id']) => void,
  ): Promise<void> {
    return done(null, user.id);
  }

  async deserializeUser(
    id: User['id'],
    done: (err: Error, user: User) => void,
  ): Promise<void> {
    // Fetch user object from the database using the provided ID
    const user = await this.userService.findOne(id);

    if (user) {
      return done(null, user);
    } else {
      return done(new Error('User not found'), null);
    }
  }
}
