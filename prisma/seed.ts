import type { Hint } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { EHint, ETimeOfDay } from "~/models/enums";

const prisma = new PrismaClient();

async function seed() {
  const email1 = "celio@a.a";
  const email2 = "luana@a.a";

  // cleanup the existing database
  await prisma.challengeTemplate.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.adventureTemplate.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.challenge.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.adventure.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.hint.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.user.deleteMany().catch(() => {
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
      description: "Lorem ipsum...",
    },
  });

  const adventureTemplate2 = await prisma.adventureTemplate.create({
    data: {
      title: "Couples Edition 2",
      description: "Lorem ipsum (with cover)...",
      cover_image:
        "https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg",
    },
  });

  const hints = await Promise.all(
    Object.keys(EHint).map((hint) =>
      prisma.hint.create({
        data: {
          name: hint,
        },
      })
    )
  );

  const hintsByKey = hints.reduce(
    (all, item) => ({ ...all, [item.name]: item }),
    {} as Record<EHint, Hint>
  );

  const baseChallengeTemplates = [
    {
      title: "The Helpless Baker",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      notePlaceholder: "How was the challenge?",
      position: 0,
      cost_euros: 0,
      time_of_day: ETimeOfDay.ANY,
      duration_minutes: 60,
      hints: [EHint.HOME],
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
      notePlaceholder: "Was it hard to complete the challenge?",
      position: 1,
      cost_euros: 12,
      time_of_day: ETimeOfDay.ANY,
      duration_minutes: 15,
      hints: [EHint.HOME, EHint.SHOPPING_CART],
    },
    {
      title: "The Helpless Baker 3",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
      `,
      notePlaceholder: "Have you had fun on your challenge?",
      position: 2,
      cost_euros: 75.75,
      time_of_day: ETimeOfDay.AFTERNOON,
      duration_minutes: 92,
      hints: [],
    },
    {
      title:
        "The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      position: 3,
      cost_euros: 0,
      time_of_day: ETimeOfDay.NIGHT,
      duration_minutes: 432,
      hints: [EHint.HOME],
    },
    {
      title:
        "The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker 2",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      position: 4,
      cost_euros: 0.32,
      time_of_day: ETimeOfDay.MORNING,
      duration_minutes: 7,
      hints: [EHint.SHOPPING_CART],
    },
  ];

  const challengeTemplates = await Promise.all(
    baseChallengeTemplates.map((item) =>
      prisma.challengeTemplate.create({
        data: {
          title: item.title,
          description: item.description,
          notePlaceholder: item.notePlaceholder,
          position: item.position,
          cost_euros: item.cost_euros,
          time_of_day: item.time_of_day,
          duration_minutes: item.duration_minutes,
          adventureTemplateId: adventureTemplate.id,
          hints: {
            create: item.hints.map((hint) => ({
              hint: {
                connect: {
                  id: hintsByKey[hint].id,
                },
              },
            })),
          },
        },
      })
    )
  );

  const challengeTemplates2 = await Promise.all(
    baseChallengeTemplates.map((item) =>
      prisma.challengeTemplate.create({
        data: {
          title: item.title,
          description: item.description,
          notePlaceholder: item.notePlaceholder,
          position: item.position,
          cost_euros: item.cost_euros,
          time_of_day: item.time_of_day,
          duration_minutes: item.duration_minutes,
          adventureTemplateId: adventureTemplate2.id,
          hints: {
            create: item.hints.map((hint) => ({
              hint: {
                connect: {
                  id: hintsByKey[hint].id,
                },
              },
            })),
          },
        },
      })
    )
  );

  const adventure = await prisma.adventure.create({
    data: {
      adventureTemplateId: adventureTemplate.id,
      users: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  });

  const adventure2 = await prisma.adventure.create({
    data: {
      adventureTemplateId: adventureTemplate2.id,
      users: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  });

  const baseChallenges = [
    {
      revealed: true,
      completed: true,
      note: `"Smells like a love spirit". Delicious granola made by four hands and two eyes. A lot of love in one recipe.`,
    },
    {
      revealed: true,
      completed: false,
    },
    {
      revealed: false,
      completed: false,
    },
    {
      revealed: true,
      completed: false,
    },
    {
      revealed: true,
      completed: false,
    },
  ];

  await Promise.all(
    baseChallenges.map((item, index) =>
      prisma.challenge.create({
        data: {
          revealed: item.revealed,
          completed: item.completed,
          note: item.note,
          adventureId: adventure.id,
          challengeTemplateId: challengeTemplates[index].id,
        },
      })
    )
  );

  await Promise.all(
    baseChallenges.map((item, index) =>
      prisma.challenge.create({
        data: {
          revealed: item.revealed,
          completed: item.completed,
          note: item.note,
          adventureId: adventure2.id,
          challengeTemplateId: challengeTemplates2[index].id,
        },
      })
    )
  );

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
