import { prisma } from '@/lib/db';

export const DEV_USER_ID = 'dev-student';

export async function getCurrentUser() {
  return prisma.user.upsert({
    where: { id: DEV_USER_ID },
    update: {},
    create: {
      id: DEV_USER_ID,
      role: 'student',
      loginId: 'dev_student',
      name: '이현동',
      phone: '01000000000',
      studentProfile: {
        create: {
          gender: 'male',
          birthYear: 2001,
          skillLevel: 'beginner',
          profileCompletionScore: 45,
        },
      },
    },
    include: {
      studentProfile: true,
    },
  });
}
