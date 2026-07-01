import { PrismaClient } from '@prisma/client';
import { facilities, genres, goals, locationSeed, neighborhoodId, tags } from './seed-data';

const prisma = new PrismaClient();

async function clear() {
  await prisma.userSession.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.reviewReaction.deleteMany();
  await prisma.review.deleteMany();
  await prisma.trainerMedia.deleteMany();
  await prisma.trainerWork.deleteMany();
  await prisma.trainerCareer.deleteMany();
  await prisma.trainerEducation.deleteMany();
  await prisma.trainerRecommendedFor.deleteMany();
  await prisma.trainerFacility.deleteMany();
  await prisma.trainerTag.deleteMany();
  await prisma.trainerGoal.deleteMany();
  await prisma.trainerGenre.deleteMany();
  await prisma.studentGenre.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.userDailyDismissal.deleteMany();
  await prisma.user.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.neighborhood.deleteMany();
  await prisma.district.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.lessonGoal.deleteMany();
  await prisma.genre.deleteMany();
}

export async function seedReferenceData(client: PrismaClient) {
  await client.genre.createMany({
    data: genres.map((name, index) => ({ id: `genre-${index + 1}`, name, sortOrder: index })),
  });
  await client.lessonGoal.createMany({
    data: goals.map((name, index) => ({ id: `goal-${index + 1}`, name, sortOrder: index })),
  });
  await client.facility.createMany({
    data: facilities.map((name, index) => ({ id: `facility-${index + 1}`, name, sortOrder: index })),
  });
  await client.tag.createMany({
    data: tags.map((name, index) => ({ id: `tag-${index + 1}`, name })),
  });

  for (const district of locationSeed) {
    await client.district.create({
      data: {
        id: district.id,
        name: district.name,
        neighborhoods: {
          create: district.neighborhoods.map((name) => ({
            id: neighborhoodId(district.id, name),
            name,
          })),
        },
      },
    });
  }
}

async function main() {
  await clear();
  await seedReferenceData(prisma);
}

if (require.main === module) {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
