import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as passport from 'passport';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
      proxy: true,
      cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1year
        domain: (process.env.NODE_ENV && '.degenlegends.io') || '',
        secure: (process.env.NODE_ENV && true) || false, // only send cookie over HTTPS
        httpOnly: (process.env.NODE_ENV && true) || false, // prevent client-side access to cookie
        sameSite: 'lax', // reduce CSRF vulnerability
      },
    }),
  );

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());

  const corsOptions: CorsOptions = {
    origin: [
      process.env.FRONT_URL,
      'https://raid2earn.herokuapp.com',
      '.degenlegends.io',
    ],
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
