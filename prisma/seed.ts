import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email1 = "celio@a.a";
  const email2 = "luana@a.a";

  // cleanup the existing database
  await prisma.user.deleteMany({ where: { email: { in: [email1, email2]} } }).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.adventureTemplate.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("celio@a.a", 10);

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
      title: "Couples Edition",
      description: "Lorem ipsum..."
    },
  });

  const challengeTemplates = await Promise.all([
    {
      title: "The Helpless Baker",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      position: 0
    },
    {
      title: "The Helpless Baker 2",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      position: 1
    },
    {
      title: "The Helpless Baker 3",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
      `,
      position: 2
    },
    {
      title: "The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      position: 3
    },
    {
      title: "The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker 2",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      position: 4
    },
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
    {
      revealed: true, completed: true, challengeTemplateId: challengeTemplates[0].id,
      note: `
        <p>"Smells like a love spirit"</p>
        <p>Delicious granola made by four hands and two eyes.</p>
        <p>A lot of love in one recipe.</p>
      `
    },
    { revealed: true, completed: false, challengeTemplateId: challengeTemplates[1].id },
    { revealed: false, completed: false, challengeTemplateId: challengeTemplates[2].id },
    { revealed: true, completed: false, challengeTemplateId: challengeTemplates[3].id },
    { revealed: true, completed: false, challengeTemplateId: challengeTemplates[4].id },
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
