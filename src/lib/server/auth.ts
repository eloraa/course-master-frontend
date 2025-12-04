import { AuthUser, UserRole } from '@/types/user';
import { getServerSession, type NextAuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    role?: UserRole;
    accessToken?: string;
    tokenType?: string;
    profile?: AuthUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    tokenType?: string;
    profile?: AuthUser;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: { type: 'email' }, password: { type: 'password' } },
      async authorize(credentials) {
        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({ ...credentials }),
        });

        console.log(res, 'resres');

        const responseData = await res.json();

        if (!res.ok || responseData.status !== 'success' || !responseData.user) {
          throw new Error(responseData.message || 'Invalid credentials');
        }

        const user: AuthUser = {
          id: String(responseData.user.id),
          name: responseData.user.name,
          email: responseData.user.email,
          role: responseData.user.role,
          accessToken: responseData.token.accessToken,
          tokenType: responseData.token.tokenType,
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === 'object' && 'accessToken' in user && 'role' in user && 'tokenType' in user && 'id' in user) {
        const authUser = user as AuthUser;
        token.id = authUser.id;
        token.name = authUser.name;
        token.email = authUser.email;
        token.role = authUser.role;
        token.accessToken = authUser.accessToken;
        token.tokenType = authUser.tokenType;
      }
      return token;
    },
    async session({ session, token }) {
      let profile: AuthUser | undefined;

      if (token.accessToken && token.tokenType) {
        try {
          const profileRes = await fetch(`${process.env.API_URL}/me`, {
            headers: {
              Authorization: `${token.tokenType} ${token.accessToken}`,
            },
          });

          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.status === 'success' && profileData.data) {
              profile = profileData.data;
            }
          }
        } catch (error) {
          console.error(error);
          profile = token.profile as AuthUser | undefined;
        }
      } else {
        // Fallback to cached profile if no token
        profile = token.profile as AuthUser | undefined;
      }

      session.user = {
        name: token.name as string,
        email: token.email as string,
      };

      return {
        ...session,
        user: session.user,
        role: typeof token.role === 'string' ? token.role : undefined,
        accessToken: typeof token.accessToken === 'string' ? token.accessToken : undefined,
        tokenType: typeof token.tokenType === 'string' ? token.tokenType : undefined,
        profile: profile || undefined,
      };
    },
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
