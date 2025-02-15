const { PrismaClient } = require("@prisma/client");
const prismaMiddleware = require("./middleware");

const prisma = new PrismaClient();
prismaMiddleware(prisma).catch(console.error);

module.exports = prisma;
