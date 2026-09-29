-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExtensionToken" DROP CONSTRAINT "ExtensionToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "FacebookConnection" DROP CONSTRAINT "FacebookConnection_userId_fkey";

-- DropForeignKey
ALTER TABLE "MergeRequest" DROP CONSTRAINT "MergeRequest_destinationPageId_fkey";

-- DropForeignKey
ALTER TABLE "MergeRequest" DROP CONSTRAINT "MergeRequest_sourcePageId_fkey";

-- DropForeignKey
ALTER TABLE "MergeRequest" DROP CONSTRAINT "MergeRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_connectionId_fkey";

-- AddForeignKey
ALTER TABLE "FacebookConnection" ADD CONSTRAINT "FacebookConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "FacebookConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergeRequest" ADD CONSTRAINT "MergeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergeRequest" ADD CONSTRAINT "MergeRequest_sourcePageId_fkey" FOREIGN KEY ("sourcePageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergeRequest" ADD CONSTRAINT "MergeRequest_destinationPageId_fkey" FOREIGN KEY ("destinationPageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtensionToken" ADD CONSTRAINT "ExtensionToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
