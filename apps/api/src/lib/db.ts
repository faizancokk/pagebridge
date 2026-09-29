import PrismaPackage from "@prisma/client";
const { PrismaClient } = PrismaPackage as unknown as { PrismaClient: new () => any };
export const db = new PrismaClient();
