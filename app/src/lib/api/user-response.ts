import type { User } from '@prisma/client';

export function toAuthUser(user: Pick<User, 'id' | 'role' | 'loginId' | 'name' | 'phone'>) {
  return {
    id: user.id,
    role: user.role,
    loginId: user.loginId,
    name: user.name,
    phone: user.phone,
  };
}
