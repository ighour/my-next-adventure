import type { Hint } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { EHint, ETimeOfDay } from "~/models/enums";

const prisma = new PrismaClient();

async function seed() {
  const now = dayjs();

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
  await prisma.userInvite.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("celio@a.a", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "celio@a.a",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: "luana@a.a",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
  await prisma.user.create({
    data: {
      email: "a@a.a",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.userInvite.create({
    data: {
      validUntil: new Date(),
    },
  });
  await prisma.userInvite.create({
    data: {
      validUntil: now.add(1, "month").toDate(),
    },
  });

  const adventureTemplate = await prisma.adventureTemplate.create({
    data: {
      title: "Couples Edition",
      description: "Lorem ipsum...",
      maxJoiners: 1,
      nextChallengeRevealHours: 0
    },
  });

  const adventureTemplate2 = await prisma.adventureTemplate.create({
    data: {
      title: "Couples Edition 2",
      description: "Lorem ipsum (with cover)...",
      maxJoiners: 2,
      nextChallengeRevealHours: 36,
      coverImage:
        "https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
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
      costEuros: 0,
      timeOfDay: ETimeOfDay.ANY,
      durationMinutes: 60,
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
      costEuros: 12,
      timeOfDay: ETimeOfDay.ANY,
      durationMinutes: 15,
      hints: [EHint.HOME, EHint.SHOPPING_CART],
    },
    {
      title: "The Helpless Baker 3",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
      `,
      notePlaceholder: "Have you had fun on your challenge?",
      costEuros: 75.75,
      timeOfDay: ETimeOfDay.AFTERNOON,
      durationMinutes: 92,
      hints: [],
    },
    {
      title:
        "The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      costEuros: 0,
      timeOfDay: ETimeOfDay.NIGHT,
      durationMinutes: 432,
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
      costEuros: 0.32,
      timeOfDay: ETimeOfDay.MORNING,
      durationMinutes: 7,
      hints: [EHint.SHOPPING_CART],
    },
  ];

  const challengeTemplates = await Promise.all(
    baseChallengeTemplates.map((item, index) =>
      prisma.challengeTemplate.create({
        data: {
          title: item.title,
          description: item.description,
          notePlaceholder: item.notePlaceholder,
          costEuros: item.costEuros,
          timeOfDay: item.timeOfDay,
          durationMinutes: item.durationMinutes,
          adventureTemplates: {
            create: [
              {
                adventureTemplate: {
                  connect: {
                    id: adventureTemplate.id
                  }
                },
                position: index
              }
            ]
          },
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
    baseChallengeTemplates.map((item, index) =>
      prisma.challengeTemplate.create({
        data: {
          title: item.title,
          description: item.description,
          notePlaceholder: item.notePlaceholder,
          costEuros: item.costEuros,
          timeOfDay: item.timeOfDay,
          durationMinutes: item.durationMinutes,
          adventureTemplates: {
            create: [
              {
                adventureTemplate: {
                  connect: {
                    id: adventureTemplate2.id
                  }
                },
                position: index
              }
            ]
          },
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
      title: adventureTemplate.title,
      description: adventureTemplate.description,
      maxJoiners: adventureTemplate.maxJoiners,
      nextChallengeRevealHours: adventureTemplate.nextChallengeRevealHours,
      adventureTemplateId: adventureTemplate.id,
      creatorId: user1.id,
      joiners: {
        connect: [{ id: user2.id }],
      },
    },
  });

  const adventure2 = await prisma.adventure.create({
    data: {
      title: adventureTemplate.title,
      description: adventureTemplate.description,
      maxJoiners: adventureTemplate.maxJoiners,
      nextChallengeRevealHours: adventureTemplate2.nextChallengeRevealHours,
      adventureTemplateId: adventureTemplate2.id,
      creatorId: user2.id,
      joiners: {
        connect: [{ id: user1.id }],
      },
    },
  });

  const baseChallenges = [
    {
      canBeRevealedAt: now,
      revealed: true,
      completed: true,
      note: `"Smells like a love spirit". Delicious granola made by four hands and two eyes. A lot of love in one recipe.`,
      completedImage: "https://healingcenterseattle.org/thcroot/wp-content/uploads/2020/10/volunteerGroup.jpg"
    },
    {
      canBeRevealedAt: now,
      revealed: true,
      completed: false,
    },
    {
      canBeRevealedAt: now,
      revealed: false,
      completed: false,
    },
    {
      revealed: false,
      completed: false,
    },
    {
      revealed: false,
      completed: false,
    },
  ];

  await Promise.all(
    baseChallenges.map((item, index) =>
      prisma.challenge.create({
        data: {
          revealedAt: item.revealed ? new Date() : null,
          completedAt: item.completed ? new Date() : null,
          note: item.note,
          completedImage: item.completedImage,
          adventureId: adventure.id,
          challengeTemplateId: challengeTemplates[index].id,
          position: index,
          canBeRevealedAt: item.canBeRevealedAt?.toISOString()
        },
      })
    )
  );

  await Promise.all(
    baseChallenges.map((item, index) =>
      prisma.challenge.create({
        data: {
          revealedAt: item.revealed ? new Date() : null,
          completedAt: item.completed ? new Date() : null,
          note: item.note,
          adventureId: adventure2.id,
          challengeTemplateId: challengeTemplates2[index].id,
          position: index,
          canBeRevealedAt: item.canBeRevealedAt?.toISOString()
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
