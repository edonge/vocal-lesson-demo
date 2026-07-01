import { PrismaClient } from '@prisma/client';
import { facilities, genres, goals, locationSeed, neighborhoodId, tags } from './seed-data';

const prisma = new PrismaClient();

const LEGACY_SEED_TRAINER_IDS = Array.from({ length: 9 }, (_, index) => `trainer-${index + 1}`);
const LEGACY_SEED_BANNER_IDS = Array.from({ length: 5 }, (_, index) => `banner-${index + 1}`);
const DEV_USER_ID = 'dev-student';
const DEV_LOGIN_ID = 'devstudent';

async function removeLegacySeedData() {
  await prisma.message.deleteMany({
    where: {
      OR: [
        { senderUserId: DEV_USER_ID },
        { room: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } },
        { room: { studentId: DEV_USER_ID } },
      ],
    },
  });
  await prisma.chatRoom.deleteMany({
    where: {
      OR: [
        { studentId: DEV_USER_ID },
        { trainerId: { in: LEGACY_SEED_TRAINER_IDS } },
      ],
    },
  });
  await prisma.bookmark.deleteMany({
    where: {
      OR: [
        { userId: DEV_USER_ID },
        { trainerId: { in: LEGACY_SEED_TRAINER_IDS } },
      ],
    },
  });
  await prisma.reviewReaction.deleteMany({
    where: {
      OR: [
        { userId: DEV_USER_ID },
        { review: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } },
      ],
    },
  });
  await prisma.review.deleteMany({ where: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.trainerMedia.deleteMany({ where: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.trainerWork.deleteMany({ where: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.trainerCareer.deleteMany({ where: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.trainerEducation.deleteMany({ where: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.trainerRecommendedFor.deleteMany({ where: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.trainerFacility.deleteMany({ where: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.trainerTag.deleteMany({ where: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.trainerGoal.deleteMany({ where: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.trainerGenre.deleteMany({ where: { trainerId: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.trainerProfile.deleteMany({ where: { id: { in: LEGACY_SEED_TRAINER_IDS } } });
  await prisma.banner.deleteMany({ where: { id: { in: LEGACY_SEED_BANNER_IDS } } });
  await prisma.userDailyDismissal.deleteMany({ where: { userId: DEV_USER_ID } });
  await prisma.userSession.deleteMany({ where: { userId: DEV_USER_ID } });
  await prisma.studentGenre.deleteMany({ where: { studentId: DEV_USER_ID } });
  await prisma.studentProfile.deleteMany({ where: { userId: DEV_USER_ID } });
  await prisma.user.deleteMany({
    where: {
      OR: [
        { id: DEV_USER_ID },
        { loginId: DEV_LOGIN_ID },
      ],
    },
  });
}

async function seedReferenceData() {
  for (let index = 0; index < genres.length; index += 1) {
    const name = genres[index];
    await prisma.genre.upsert({
      where: { name },
      create: { id: `genre-${index + 1}`, name, sortOrder: index },
      update: { sortOrder: index },
    });
  }

  for (let index = 0; index < goals.length; index += 1) {
    const name = goals[index];
    await prisma.lessonGoal.upsert({
      where: { name },
      create: { id: `goal-${index + 1}`, name, sortOrder: index },
      update: { sortOrder: index },
    });
  }

  for (let index = 0; index < facilities.length; index += 1) {
    const name = facilities[index];
    await prisma.facility.upsert({
      where: { name },
      create: { id: `facility-${index + 1}`, name, sortOrder: index },
      update: { sortOrder: index },
    });
  }

  for (let index = 0; index < tags.length; index += 1) {
    const name = tags[index];
    await prisma.tag.upsert({
      where: { name },
      create: { id: `tag-${index + 1}`, name },
      update: {},
    });
  }

  for (const district of locationSeed) {
    await prisma.district.upsert({
      where: { name: district.name },
      create: { id: district.id, name: district.name },
      update: {},
    });

    for (const name of district.neighborhoods) {
      await prisma.neighborhood.upsert({
        where: {
          districtId_name: {
            districtId: district.id,
            name,
          },
        },
        create: {
          id: neighborhoodId(district.id, name),
          districtId: district.id,
          name,
        },
        update: {},
      });
    }
  }
}

async function main() {
  await removeLegacySeedData();
  await seedReferenceData();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
