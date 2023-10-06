-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publicKey" TEXT,
    "walletName" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT,
    "discriminator" TEXT,
    "accent_color" INTEGER,
    "avatar" TEXT,
    "avatar_decoration" TEXT,
    "banner" TEXT,
    "banner_color" TEXT,
    "display_name" TEXT,
    "flags" INTEGER,
    "locale" TEXT,
    "mfa_enabled" BOOLEAN,
    "premium_type" INTEGER,
    "public_flags" INTEGER,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "provider" TEXT,
    "fetchedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "discord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitter" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "profileImageUrl" TEXT,
    "username" TEXT,
    "accessToken" TEXT,
    "accessTokenExpiry" TIMESTAMP(3),
    "refreshToken" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "twitter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_publicKey_key" ON "wallet"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "discord_userId_key" ON "discord"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "twitter_username_key" ON "twitter"("username");

-- CreateIndex
CREATE UNIQUE INDEX "twitter_userId_key" ON "twitter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discord" ADD CONSTRAINT "discord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twitter" ADD CONSTRAINT "twitter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
