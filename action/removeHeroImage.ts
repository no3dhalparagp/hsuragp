"use server";

import { utapi } from "@/server/uploadthings";

export const removeHeroImage = async (imageKey: string) => {
  try {
    await utapi.deleteFiles(imageKey);
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

export const removeProfilePreviwImage = async (imageKey: string) => {
  try {
    await utapi.deleteFiles(imageKey);
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};
