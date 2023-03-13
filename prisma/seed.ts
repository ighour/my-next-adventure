import type { Hint } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { EDurationCode, EHint, EInviteType } from "~/enums";
import { createInvite } from "~/models/invite.server";
import { ECurrencyCode, ELanguageCode, ETimeOfDayCode } from "~/enums";

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
  await prisma.invite.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("celio@a.a", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "celio@a.a",
      username: "celio",
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
      username: "luana",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
  const user3 = await prisma.user.create({
    data: {
      email: "a@a.a",
      username: "aaa",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await createInvite({
    type: EInviteType.PLATFORM,
    expireAt: now.toDate(),
  });
  await createInvite({
    type: EInviteType.PLATFORM,
    remainingUses: 1,
  });
  await createInvite({
    type: EInviteType.PLATFORM,
  });

  const adventureTemplate = await prisma.adventureTemplate.create({
    data: {
      title: "Vida de Casal",
      description: "Lorem ipsum...",
      maxJoiners: 1,
      nextChallengeRevealHours: 0
    },
  });

  const adventureTemplate2 = await prisma.adventureTemplate.create({
    data: {
      title: "Vida de Casal 2",
      description: "Lorem ipsum (com capa)...",
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
      title: "Ajuda na Cozinha",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      notePlaceholder: "How was the challenge?",
      cost: ECurrencyCode.FREE,
      timeOfDay: ETimeOfDayCode.ANY,
      duration: EDurationCode.HOUR,
      hints: [EHint.HOME],
      languageCode: ELanguageCode.PT,
    },
    {
      title: "Ajuda na Cozinha 2",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      notePlaceholder: "Was it hard to complete the challenge?",
      cost: ECurrencyCode.LOW,
      timeOfDay: ETimeOfDayCode.ANY,
      duration: EDurationCode.QUARTER_HOUR,
      hints: [EHint.HOME, EHint.SHOPPING_CART],
      languageCode: ELanguageCode.PT,
    },
    {
      title: "Ajuda na Cozinha 3",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
      `,
      notePlaceholder: "Have you had fun on your challenge?",
      cost: ECurrencyCode.HIGH,
      timeOfDay: ETimeOfDayCode.AFTERNOON,
      duration: EDurationCode.HALF_HOUR,
      hints: [],
      languageCode: ELanguageCode.PT,
    },
    {
      title:
        "The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker The Helpless Baker",
      description: `
        <p>Make a homemade pie together! Easier said than done! One of you must mix all the ingredients by yourself...BLINDFOLDED, while the other person gives instructions by leading with their hands.</p>
        <p>The leader can only use three directive sentences the whole time. (The person with the least amount of cooking experience has to be the blindfolded mixer!)</p>
      `,
      cost: ECurrencyCode.FREE,
      timeOfDay: ETimeOfDayCode.NIGHT,
      duration: EDurationCode.HALF_DAY,
      hints: [EHint.HOME],
      languageCode: ELanguageCode.PT,
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
      cost: ECurrencyCode.MEDIUM,
      timeOfDay: ETimeOfDayCode.MORNING,
      duration: EDurationCode.DAY,
      hints: [EHint.SHOPPING_CART],
      languageCode: ELanguageCode.PT,
    },
  ];

  const challengeTemplates = await Promise.all(
    baseChallengeTemplates.map((item, index) =>
      prisma.challengeTemplate.create({
        data: {
          title: `${item.title} (${index+1})`,
          description: item.description,
          notePlaceholder: item.notePlaceholder,
          cost: item.cost,
          timeOfDay: item.timeOfDay,
          duration: item.duration,
          languageCode: item.languageCode,
          adventureTemplates: {
            create: [
              {
                adventureTemplate: {
                  connect: {
                    id: adventureTemplate.id
                  }
                },
                position: index
              },
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
      title: adventureTemplate2.title,
      description: adventureTemplate2.description,
      maxJoiners: adventureTemplate2.maxJoiners,
      nextChallengeRevealHours: adventureTemplate2.nextChallengeRevealHours,
      adventureTemplateId: adventureTemplate2.id,
      creatorId: user2.id,
      joiners: {
        connect: [{ id: user1.id }],
      },
    },
  });

  const adventure3 = await prisma.adventure.create({
    data: {
      title: adventureTemplate.title + " 3",
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

  const adventure4 = await prisma.adventure.create({
    data: {
      title: adventureTemplate.title + " 4",
      description: adventureTemplate.description,
      maxJoiners: adventureTemplate.maxJoiners,
      nextChallengeRevealHours: adventureTemplate.nextChallengeRevealHours,
      adventureTemplateId: adventureTemplate.id,
      creatorId: user3.id
    },
  });


  await createInvite({
    type: EInviteType.ADVENTURE,
    adventureId: adventure4.id,
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
          adventureId: adventure3.id,
          challengeTemplateId: challengeTemplates[0].id,
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
          adventureId: adventure4.id,
          challengeTemplateId: challengeTemplates[0].id,
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
