"use server";

import * as z from "zod";
import { LoginSchema } from "@/schema";
import { signIn } from "@/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_ADMINLOGIN_REDIRECT,
  DEFAULT_STAFFLOGIN_REDIRECT,
  DEFAULT_SUPERADMINLOGIN_REDIRECT,
} from "@/routes";
import { AuthError } from "next-auth";
import { getUserEmail } from "@/data/user";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmByUserId } from "@/data/two-factor-confirm";
import { db } from "@/lib/db";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Confirmation email sent" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid code" };
      }

      if (new Date(twoFactorToken.expires) < new Date()) {
        return { error: "Code expired" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirection
    });

    // Define role-based redirects using an object map
    const roleRedirects = {
      admin: DEFAULT_ADMINLOGIN_REDIRECT,
      staff: DEFAULT_STAFFLOGIN_REDIRECT,
      superadmin: DEFAULT_SUPERADMINLOGIN_REDIRECT,
      default: DEFAULT_LOGIN_REDIRECT
    };

    // Get redirect URL based on user role, fallback to default if role not found
    const redirectUrl = roleRedirects[existingUser.role as keyof typeof roleRedirects] || roleRedirects.default;

    return { success: "Logged in successfully", redirectUrl };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
