import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  const email = 'john@doe.com';
  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {});

  const hashedPassword = await bcrypt.hash('asdfasdf', 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username: 'John Doe',
    },
  });

  await prisma.todo.create({
    data: {
      title: 'Setup a GraphQL server',
      userId: user.id,
    },
  });

  await prisma.todo.create({
    data: {
      title: 'Setup a react client',
      userId: user.id,
    },
  });
  // eslint-disable-next-line no-console
  console.log(`Database has been seeded.`);
}

seed()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
