"use server";

import * as z from "zod";
import { LoginSchema } from "@/schema";

import { signIn } from "@/auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_ADMINLOGIN_REDIRECT,
  DEFAULT_STAFFLOGIN_REDIRECT,
  DEFAULT_AGENCYLOGIN_REDIRECT,
  DEFAULT_SUPERADMINLOGIN_REDIRECT,
} from "@/routes";

import { AuthError } from "next-auth";

import { getUserEmail } from "@/data/user";

import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/token";

import {
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "@/lib/mail";

import { getTwoFactorTokenEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmByUserId } from "@/data/two-factor-confirm";

import { db } from "@/lib/db";

import { headers } from "next/headers";

//////////////////////////////////////////////////////////
// SETTINGS
//////////////////////////////////////////////////////////

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;

const MAX_IP_ATTEMPTS = 10;
const IP_BLOCK_MINUTES = 30;

//////////////////////////////////////////////////////////
// GET CLIENT IP
//////////////////////////////////////////////////////////

async function getClientIP(): Promise<string> {

  const headersList = await headers();

  const forwarded = headersList.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return headersList.get("x-real-ip") || "unknown";
}

//////////////////////////////////////////////////////////
// RECORD LOGIN ATTEMPT
//////////////////////////////////////////////////////////

async function recordLoginAttempt(
  email: string,
  ipAddress: string,
  success: boolean
) {

  await db.loginAttempt.create({
    data: {
      email,
      ipAddress,
      success,
    },
  });

}

//////////////////////////////////////////////////////////
// HANDLE FAILED LOGIN
//////////////////////////////////////////////////////////

async function handleFailedLogin(
  user: any,
  ipAddress: string
) {

  const attempts = user.failedLoginAttempts + 1;

  ////////////////////////////////////////////////////////
  // LOCK ACCOUNT
  ////////////////////////////////////////////////////////

  if (attempts >= MAX_FAILED_ATTEMPTS) {

    await db.user.update({

      where: { id: user.id },

      data: {

        failedLoginAttempts: 0,

        lockoutExpiry: new Date(
          Date.now() + LOCK_TIME_MINUTES * 60000
        ),

      },

    });

    return {
      error: `Your account has been locked for ${LOCK_TIME_MINUTES} minutes due to multiple failed login attempts.`,
    };
  }

  ////////////////////////////////////////////////////////
  // UPDATE FAILED ATTEMPTS
  ////////////////////////////////////////////////////////

  await db.user.update({

    where: { id: user.id },

    data: {

      failedLoginAttempts: attempts,

    },

  });

  ////////////////////////////////////////////////////////
  // RECORD FAILED LOGIN
  ////////////////////////////////////////////////////////

  await recordLoginAttempt(
    user.email,
    ipAddress,
    false
  );

  ////////////////////////////////////////////////////////
  // IP BLOCK CHECK
  ////////////////////////////////////////////////////////

  const failedCount = await db.loginAttempt.count({

    where: {

      ipAddress,

      success: false,

      createdAt: {

        gte: new Date(
          Date.now() - 10 * 60 * 1000
        ),

      },

    },

  });

  if (failedCount >= MAX_IP_ATTEMPTS) {

    await db.blockedIP.upsert({

      where: { ipAddress },

      update: {

        expiresAt: new Date(
          Date.now() + IP_BLOCK_MINUTES * 60000
        ),

      },

      create: {

        ipAddress,

        expiresAt: new Date(
          Date.now() + IP_BLOCK_MINUTES * 60000
        ),

      },

    });

  }

  const remainingAttempts =
    MAX_FAILED_ATTEMPTS - attempts;

  return {
    error: `Invalid email or password. ${remainingAttempts} attempt(s) remaining.`,
  };
}

//////////////////////////////////////////////////////////
// LOGIN FUNCTION
//////////////////////////////////////////////////////////

export const login = async (
  values: z.infer<typeof LoginSchema>
) => {

  ////////////////////////////////////////////////////////
  // VALIDATE INPUT
  ////////////////////////////////////////////////////////

  const validatedFields =
    LoginSchema.safeParse(values);

  if (!validatedFields.success) {

    return { error: "Invalid input fields." };

  }

  const { email, password, code } =
    validatedFields.data;

  ////////////////////////////////////////////////////////
  // GET IP
  ////////////////////////////////////////////////////////

  const ipAddress = await getClientIP();

  ////////////////////////////////////////////////////////
  // CHECK IP BLOCK
  ////////////////////////////////////////////////////////

  const blockedIP =
    await db.blockedIP.findUnique({

      where: { ipAddress },

    });

  if (
    blockedIP &&
    blockedIP.expiresAt &&
    blockedIP.expiresAt > new Date()
  ) {

    const remainingMinutes = Math.ceil(
      (blockedIP.expiresAt.getTime() - Date.now()) / 60000
    );

    return {
      error: `Too many failed login attempts. Your IP is blocked for ${remainingMinutes} minutes.`,
    };
  }

  ////////////////////////////////////////////////////////
  // FIND USER
  ////////////////////////////////////////////////////////

  const existingUser =
    await getUserEmail(email);

  if (
    !existingUser ||
    !existingUser.email ||
    !existingUser.password
  ) {

    await recordLoginAttempt(
      email,
      ipAddress,
      false
    );

    return {
      error:
        "No account found with this email address.",
    };
  }

  ////////////////////////////////////////////////////////
  // ACCOUNT LOCK CHECK
  ////////////////////////////////////////////////////////

  if (
    existingUser.lockoutExpiry &&
    existingUser.lockoutExpiry > new Date()
  ) {

    const remainingMinutes = Math.ceil(
      (existingUser.lockoutExpiry.getTime() - Date.now()) / 60000
    );

    return {
      error:
        `Your account is locked. Try again after ${remainingMinutes} minutes.`,
    };
  }

  ////////////////////////////////////////////////////////
  // EMAIL VERIFICATION
  ////////////////////////////////////////////////////////

  if (!existingUser.emailVerified) {

    const verificationToken =
      await generateVerificationToken(
        existingUser.email
      );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success:
        "Verification email sent. Please check your inbox.",
    };
  }

  ////////////////////////////////////////////////////////
  // TWO FACTOR AUTH
  ////////////////////////////////////////////////////////

  if (
    existingUser.isTwoFactorEnabled &&
    existingUser.email
  ) {

    if (code) {

      const twoFactorToken =
        await getTwoFactorTokenEmail(
          existingUser.email
        );

      if (
        !twoFactorToken ||
        twoFactorToken.token !== code
      ) {

        return {
          error:
            "Invalid verification code.",
        };
      }

      if (
        new Date(twoFactorToken.expires) <
        new Date()
      ) {

        return {
          error:
            "Verification code expired.",
        };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation =
        await getTwoFactorConfirmByUserId(
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

      const twoFactorToken =
        await generateTwoFactorToken(
          existingUser.email
        );

      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token
      );

      return { twoFactor: true };
    }

  }

  ////////////////////////////////////////////////////////
  // SIGN IN
  ////////////////////////////////////////////////////////

  try {

    await signIn("credentials", {

      email,

      password,

      redirect: false,

    });

    //////////////////////////////////////////////////////
    // RESET FAILED ATTEMPTS
    //////////////////////////////////////////////////////

    await db.user.update({

      where: { id: existingUser.id },

      data: {

        failedLoginAttempts: 0,

        lockoutExpiry: null,

      },

    });

    //////////////////////////////////////////////////////
    // RECORD SUCCESS LOGIN
    //////////////////////////////////////////////////////

    await recordLoginAttempt(
      email,
      ipAddress,
      true
    );

    //////////////////////////////////////////////////////
    // ROLE REDIRECT
    //////////////////////////////////////////////////////

    const roleRedirects = {

      admin:
        DEFAULT_ADMINLOGIN_REDIRECT,

      staff:
        DEFAULT_STAFFLOGIN_REDIRECT,

      agency:
        DEFAULT_AGENCYLOGIN_REDIRECT,

      superadmin:
        DEFAULT_SUPERADMINLOGIN_REDIRECT,

      default:
        DEFAULT_LOGIN_REDIRECT,

    };

    const redirectUrl =
      roleRedirects[
        existingUser.role as keyof typeof roleRedirects
      ] || roleRedirects.default;

    return {

      success:
        "Login successful.",

      redirectUrl,

    };

  } catch (error) {

    if (error instanceof AuthError) {

      return await handleFailedLogin(
        existingUser,
        ipAddress
      );

    }

    return {
      error:
        "Something went wrong. Please try again.",
    };

  }

};

export const resendTwoFactorCode =
  async (email: string) => {

    const existingUser =
      await getUserEmail(email);

    if (
      !existingUser ||
      !existingUser.email
    ) {

      throw new Error(
        "Email not found"
      );

    }

    if (
      !existingUser.isTwoFactorEnabled
    ) {

      throw new Error(
        "Two-factor not enabled"
      );

    }

    const twoFactorToken =
      await generateTwoFactorToken(
        existingUser.email
      );

    await sendTwoFactorTokenEmail(
      twoFactorToken.email,
      twoFactorToken.token
    );

  };
