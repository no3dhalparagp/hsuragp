import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { getTwoFactorConfirmByUserId } from "./data/two-factor-confirm";
import { getAccountUserId } from "./data/account";
import { UserRole } from "@prisma/client";
import { Adapter as CoreAdapter } from "@auth/core/adapters";
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      if (!user) {
        // Handle the case where user is undefined
        return;
      }
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const id = user.id;

      const exitingUser = await getUserById(id);

      if (!exitingUser?.emailVerified) return false;

      if (exitingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmByUserId(
          exitingUser.id
        );

        if (!twoFactorConfirmation) return false;

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user && token.email !== undefined && token.email !== null) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const exitingUser = await getUserById(token.sub);

      if (!exitingUser) return token;

      const exitingAccount = await getAccountUserId(exitingUser.id);

      token.isOAuth = !!exitingAccount;
      token.name = exitingUser.name;
      token.email = exitingUser.email;

      token.role = exitingUser.role;

      token.isTwoFactorEnabled = exitingUser.isTwoFactorEnabled;

      return token;
    },
  },

  adapter: PrismaAdapter(db) as CoreAdapter,
  session: { 
  strategy: "jwt",
  maxAge: 15 * 60, // 15 minutes in seconds
},
  ...authConfig,
});
