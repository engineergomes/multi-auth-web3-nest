import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: User['id']) {
    const user = await this.prisma.user.findUnique({
      where: { id: +id },
      include: {
        discord: true,
        wallets: true,
        twitter: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async create(user: User) {
    try {
      return await this.prisma.user.create({
        data: user,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'User with these credentials already exists',
        );
      }
      throw error;
    }
  }

  async update(id: number, user: User) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: user,
      });

      if (!updatedUser) {
        throw new NotFoundException(`User not found`);
      }

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Another user with these credentials already exists',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`User not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });
      return { message: 'User deleted' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User not found`);
      }
      throw error;
    }
  }
}
