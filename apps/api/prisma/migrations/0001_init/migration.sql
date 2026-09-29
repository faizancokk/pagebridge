CREATE TYPE "ConnectionStatus" AS ENUM ('ACTIVE','EXPIRED','REVOKED','ERROR');
CREATE TYPE "PageStatus" AS ENUM ('ACTIVE','RESTRICTED','UNKNOWN');
CREATE TYPE "MergeStatus" AS ENUM ('PENDING','CHECKING','ELIGIBLE','REQUIRES_USER_ACTION','PROCESSING','COMPLETED','FAILED','REJECTED');
CREATE TYPE "LogStatus" AS ENUM ('SUCCESS','FAILURE','INFO');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "avatar" TEXT,
  "googleSubject" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "FacebookConnection" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "metaUserId" TEXT NOT NULL,
  "encryptedAuthorizationData" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "status" "ConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
  "displayName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE ("userId","metaUserId")
);
CREATE TABLE "Page" (
  "id" TEXT PRIMARY KEY,
  "connectionId" TEXT NOT NULL REFERENCES "FacebookConnection"("id") ON DELETE CASCADE,
  "facebookPageId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT,
  "image" TEXT,
  "status" "PageStatus" NOT NULL DEFAULT 'UNKNOWN',
  "tasks" TEXT[] NOT NULL,
  "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("connectionId","facebookPageId")
);
CREATE TABLE "MergeRequest" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "sourcePageId" TEXT NOT NULL REFERENCES "Page"("id"),
  "destinationPageId" TEXT NOT NULL REFERENCES "Page"("id"),
  "status" "MergeStatus" NOT NULL DEFAULT 'PENDING',
  "eligibilityResult" JSONB,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3)
);
CREATE TABLE "ActivityLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "status" "LogStatus" NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ActivityLog_userId_createdAt_idx" ON "ActivityLog"("userId","createdAt");
CREATE TABLE "ExtensionToken" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "tokenHash" TEXT NOT NULL UNIQUE,
  "label" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastUsedAt" TIMESTAMP(3)
);
CREATE TABLE "ExtensionPairCode" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL UNIQUE,
  "redirectUri" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
