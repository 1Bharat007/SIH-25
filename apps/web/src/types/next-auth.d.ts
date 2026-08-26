import { Role } from '@prisma/client';
import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      phone?: string | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: Role;
    phone?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: Role;
    phone?: string | null;
  }
}
