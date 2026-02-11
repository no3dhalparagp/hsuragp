
'use server'





import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { utapi } from "@/server/uploadthings";
import { revalidatePath ,revalidateTag} from 'next/cache'

import { redirect } from 'next/navigation'
export const userProfileUpdate = async (
  id: string | undefined,
  name: string | undefined
) => {
  try {
    const user = await db.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    
    
    revalidatePath('/dashboard/profile')
return { success: "Date is updated...." };
    
  } catch (error) {
    return { error: "Date is not upadated ...." };
  }
};

export const userProfileImage = async (imageurl: string, imageKey: string) => {
  const cuser = await currentUser();
  const id = cuser?.id;

  try {
    const findpreimage = await db.user.findUnique({
      where: { id },
    });

    if (findpreimage) {
      const { image, imageKey } = findpreimage;

      const previmagekey = imageKey;

      if (image !== null && previmagekey !== null) {
        await utapi.deleteFiles(previmagekey);
      }
    }

    await db.user.update({
      where: {
        id,
      },
      data: {
        image: imageurl,
        imageKey,
      },
    });

    revalidateTag("dashboard/profile/changeprofileimage");
    return { success: "Profile image uploaded successfully" };
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    return { error: "An error occurred while uploading profile image" };
  }
};

export type UserRole = 'user' | 'admin' | 'staff' | 'superadmin'
export async function toggleTwoFactor(userIds: string[], enable: boolean) {
  try {
    await db.user.updateMany({
      where: {
        id: {
          in: userIds
        }
      },
      data: {
        isTwoFactorEnabled: enable
      }
    })
    return { success: true, message: `Two-factor authentication ${enable ? 'enabled' : 'disabled'} for selected users.` }
  } catch (error) {
    console.error('Error updating users:', error)
    return { success: false, message: 'Failed to update users. Please try again.' }
  }
}

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      
      select: {
        id: true,
        name: true,
        email: true,
        isTwoFactorEnabled: true,
        role: true,
        image: true,
      },
      orderBy: {
        name: 'asc'
      }
    })
    return users.map((user, index) => ({
      ...user,
      slno: index + 1,
      avatar: user.image || `/placeholder.svg?height=40&width=40`
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { role }
    })
    return { success: true, message: `User role updated to ${role}.` }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, message: 'Failed to update user role. Please try again.' }
  }
}
interface UpdateUserParams {
  id: string;
  name: string | null;
  image: string | null;
  imageKey?: string | null;
}

export async function updateUser(values: UpdateUserParams) {
  try {
    const currentUsers = await currentUser();

    if (!currentUsers) {
      return { error: "Unauthorized" };
    }

    if (currentUsers.id !== values.id) {
      return { error: "Unauthorized to update this user" };
    }

    // Find existing user data
    const existingUser = await db.user.findUnique({
      where: { id: values.id },
    });

    // Handle image deletion if there's an existing image
    if (existingUser?.imageKey && values.image !== existingUser.image) {
      await utapi.deleteFiles(existingUser.imageKey);
    }

    // Update user with new data
    const updatedUser = await db.user.update({
      where: {
        id: values.id,
      },
      data: {
        name: values.name,
        image: values.image,
        imageKey: values.imageKey ?? null,
      },
    });

    revalidatePath("/");

    return { success: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Something went wrong" };
  }
}

