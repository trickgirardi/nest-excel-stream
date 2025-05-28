import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cria um usuário para ser o autor dos posts
  const user = await prisma.user.upsert({
    where: { email: 'autor@exemplo.com' },
    update: {},
    create: {
      email: 'autor@exemplo.com',
      name: 'Autor dos Posts',
    },
  });

  const BATCH_SIZE = 1000;
  const TOTAL_POSTS = 500000;

  for (let i = 0; i < TOTAL_POSTS; i += BATCH_SIZE) {
    const data = Array.from({ length: BATCH_SIZE }, (_, idx) => ({
      title: `Título do Post #${i + idx + 1}`,
      content: `Conteúdo do post número ${i + idx + 1}`,
      published: true,
      authorId: user.id,
    }));

    await prisma.post.createMany({ data });
    console.log(`Inseridos ${Math.min(i + BATCH_SIZE, TOTAL_POSTS)} posts...`);
  }

  console.log('População concluída!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
