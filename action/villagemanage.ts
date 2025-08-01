"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function addSansad(formData: FormData) {
  const sansadname = formData.get("sansadname") as string;
  const sansadnumber = formData.get("sansadnumber") as string;

  try {
    // Check if a Sansad with the same sansadnumber already exists
    const existingSansad = await db.sansad.findUnique({
      where: {
        sansadnumber,
      },
    });

    if (existingSansad) {
      return { success: false, message: "Sansad number must be unique" };
    }

    // Create a new Sansad
    await db.sansad.create({
      data: {
        sansadname,
        sansadnumber,
      },
    });

    // Revalidate the path to update the frontend
    revalidatePath("/admindashboard/manage-villages/add-sansadno");

    return { success: true, message: "Sansad added successfully" };
  } catch (error) {
    console.error("Error adding Sansad:", error);
    return { success: false, message: "Failed to add Sansad" };
  }
}

export async function updateSansad(formData: FormData) {
  const id = formData.get("id") as string;
  const sansadname = formData.get("sansadname") as string;
  const sansadnumber = formData.get("sansadnumber") as string;

  try {
    await db.sansad.update({
      where: { id },
      data: { sansadname, sansadnumber },
    });
    revalidatePath("/admindashboard/manage-villages/add-sansadno");
    return { success: true, message: "Sansad updated successfully" };
  } catch (error) {
    console.error("Error updating Sansad:", error);
    return { success: false, message: "Failed to update Sansad" };
  }
}

export async function deleteSansad(formData: FormData) {
  const id = formData.get("id") as string;

  try {
    await db.sansad.delete({
      where: { id },
    });
    revalidatePath("/admindashboard/manage-villages/add-sansadno");
    return { success: true, message: "Sansad deleted successfully" };
  } catch (error) {
    console.error("Error deleting Sansad:", error);
    return { success: false, message: "Failed to delete Sansad" };
  }
}

export async function getSansadList() {
  try {
    return await db.sansad.findMany();
  } catch (error) {
    console.error("Error fetching Sansad list:", error);
    return [];
  }
}

export async function addMouzaname(formData: FormData) {
  const name = formData.get("name") as string;
  const jlno = formData.get("jlno") as string;

  try {
    // Create a new Mouzaname record
    await db.mouzaname.create({
      data: {
        name,
        jlno,
      },
    });
    return { success: true, message: "Mouza added successfully" };
  } catch (error) {
    console.error("Error adding Mouza:", error);
    return { success: false, message: "Failed to add Mouza" };
  }
}

export async function addPopulation() {}
