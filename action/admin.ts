import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.admin) {
    return { success: "Allowed Server Action" };
  }

  return { error: "Forbidden Server Action" };
};
