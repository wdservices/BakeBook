import type { User } from '@/types';
import { UserRole } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'user@example.com',
    name: 'Regular User',
    brandName: 'User One Bakes',
    role: UserRole.USER,
  },
  {
    id: 'admin1',
    email: 'admin@example.com',
    name: 'Admin User',
    brandName: 'Admin Bakery Pro',
    role: UserRole.ADMIN,
  },
];
