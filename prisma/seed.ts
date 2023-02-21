import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email1 = "celio@mynextadventure.com";
  const email2 = "luana@mynextadventure.com";

  // cleanup the existing database
  await prisma.user.deleteMany({ where: { email: { in: [email1, email2]} } }).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.adventureTemplate.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("secret123", 10);

  const user1 = await prisma.user.create({
    data: {
      email: email1,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: email2,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const adventureTemplate = await prisma.adventureTemplate.create({
    data: {
      title: "My first adventure",
      description: "The best adventure ever!!!"
    },
  });

  const challengeTemplates = await Promise.all([
    { title: "First challenge", description: "You need to do this.", position: 0 },
    { title: "Second challenge", description: "You need to do that.", position: 1 },
    { title: "Third challenge", description: "You need to do this again.", position: 2 },
  ].map(item => prisma.challengeTemplate.create({
    data: {
      title: item.title,
      description: item.description,
      position: item.position,
      adventureTemplateId: adventureTemplate.id
    },
  })));

  const adventure = await prisma.adventure.create({
    data: {
      adventureTemplateId: adventureTemplate.id,
      users: {
        connect: [{ id: user1.id }, { id: user2.id }]
      }
    }
  });

  await Promise.all([
    { revealed: true, completed: true, note: "Awesome!", challengeTemplateId: challengeTemplates[0].id },
    { revealed: true, completed: false, challengeTemplateId: challengeTemplates[1].id },
    { revealed: false, completed: false, challengeTemplateId: challengeTemplates[2].id },
  ].map(item => prisma.challenge.create({
    data: {
      revealed: item.revealed,
      completed: item.completed,
      note: item.note,
      adventureId: adventure.id,
      challengeTemplateId: item.challengeTemplateId
    },
  })));

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
