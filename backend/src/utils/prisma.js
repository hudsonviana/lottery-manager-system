import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // console.log('Iniciando nova instância do PrismaClient...');
  return new PrismaClient();
};

const prisma = globalThis.prismaGlobal || prismaClientSingleton();

if (['development', 'test'].includes(process.env.NODE_ENV)) {
  globalThis.prismaGlobal = prisma;
}

// process.on('exit', async () => {
//   console.log('Desconectando Prisma...');
//   await prisma.$disconnect();
// });

export default prisma;
