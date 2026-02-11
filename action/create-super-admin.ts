"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

/**
 * Create a default super admin account
 * This can be called from an API route or directly
 */
export async function createSuperAdmin(
  email: string,
  password: string,
  name?: string,
  mobileNumber?: string
) {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingSuperAdmin) {
      // Update to superadmin if not already
      if (existingSuperAdmin.role !== "superadmin") {
        await db.user.update({
          where: { id: existingSuperAdmin.id },
          data: { role: "superadmin" },
        });
        return {
          success: true,
          message: "User updated to superadmin role",
        };
      }
      return {
        success: false,
        error: "Super admin account already exists",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin user
    const superAdmin = await db.user.create({
      data: {
        name: name || "Super Administrator",
        email: email.toLowerCase(),
        mobileNumber: mobileNumber || undefined,
        password: hashedPassword,
        role: "superadmin",
        emailVerified: new Date(), // Auto-verify super admin email
        userStatus: "active",
      },
    });

    return {
      success: true,
      message: "Super admin account created successfully",
      data: {
        id: superAdmin.id,
        email: superAdmin.email,
      },
    };
  } catch (error) {
    console.error("Error creating super admin:", error);
    return {
      success: false,
      error: "Failed to create super admin account",
    };
  }
}

/**
 * Create super admin via API (no auth required for initial setup)
 */
export async function createSuperAdminPublic(
  email: string,
  password: string,
  name?: string,
  mobileNumber?: string
) {
  // Check if any super admin exists
  const existingSuperAdmin = await db.user.findFirst({
    where: { role: "superadmin" },
  });

  if (existingSuperAdmin) {
    return {
      success: false,
      error: "A super admin account already exists. Please use the existing account or contact system administrator.",
    };
  }

  return createSuperAdmin(email, password, name, mobileNumber);
}

