"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function addSansad(formData: FormData) {
  const sansadname = formData.get("sansadname") as string;
  const sansadnumber = formData.get("sansadnumber") as string;
  const financialYear = formData.get("financialYear") as string;

  try {
    // Check if a Sansad with the same sansadnumber and financialYear already exists
    const existingSansad = await db.sansad.findFirst({
      where: {
        sansadnumber,
        financialYear,
      },
    });

    if (existingSansad) {
      return { success: false, message: "Sansad number must be unique for this financial year" };
    }

    // Create a new Sansad
    await db.sansad.create({
      data: {
        sansadname,
        sansadnumber,
        financialYear,
      },
    });

    // Revalidate the path to update the frontend
    revalidatePath("/employeedashboard/village/sansad");

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
    revalidatePath("/employeedashboard/village/sansad");
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
    revalidatePath("/employeedashboard/village/sansad");
    return { success: true, message: "Sansad deleted successfully" };
  } catch (error) {
    console.error("Error deleting Sansad:", error);
    return { success: false, message: "Failed to delete Sansad" };
  }
}

export async function getSansadList(financialYear: string) {
  try {
    return await db.sansad.findMany({
      where: { financialYear },
    });
  } catch (error) {
    console.error("Error fetching Sansad list:", error);
    return [];
  }
}

export async function addMouzaname(formData: FormData) {
  const name = formData.get("name") as string;
  const jlno = formData.get("jlno") as string;
  const totalHouseholdsStr = formData.get("totalHouseholds") as string;
  const totalHouseholds = totalHouseholdsStr ? parseInt(totalHouseholdsStr) : undefined;
  const financialYear = formData.get("financialYear") as string;

  try {
    const existing = await db.mouzaname.findFirst({
      where: { jlno },
      select: { id: true },
    });
    if (existing) {
      return {
        success: false,
        message: "J.L. No. already exists",
      };
    }

    await db.mouzaname.create({ data: { name, jlno, totalHouseholds } });

    revalidatePath("/employeedashboard/village/mouza");
    return { success: true, message: "Mouza added successfully" };
  } catch (error) {
    console.error("Error adding Mouza:", error);
    return { success: false, message: "Failed to add Mouza" };
  }
}

export async function addPopulation(formData: FormData) {
  const financialYear = formData.get("financialYear") as string;
  const mouzaId = formData.get("mouzaId") as string;
  const male = parseInt(formData.get("male") as string);
  const female = parseInt(formData.get("female") as string);
  const st = parseInt(formData.get("st") as string);
  const sc = parseInt(formData.get("sc") as string);
  const obc = parseInt(formData.get("obc") as string);
  const other = parseInt(formData.get("other") as string);
  const hindu = parseInt(formData.get("hindu") as string);
  const muslim = parseInt(formData.get("muslim") as string);
  const christian = parseInt(formData.get("christian") as string);
  const otherReligion = parseInt(formData.get("otherReligion") as string);

  try {
    await db.population.create({
      data: {
        financialYear,
        mouzaId,
        male,
        female,
        st,
        sc,
        obc,
        other,
        hindu,
        muslim,
        christian,
        otherReligion,
      },
    });
    revalidatePath("/employeedashboard/village/population");
    return { success: true, message: "Population details added successfully" };
  } catch (error) {
    console.error("Error adding population details:", error);
    return { success: false, message: "Failed to add population details" };
  }
}

export async function addMember(formData: FormData) {
  const data: any = {};
  formData.forEach((value, key) => {
    if (key === "dob") {
      data[key] = new Date(value as string);
    } else {
      data[key] = value;
    }
  });

  try {
    await db.member.create({
      data: data,
    });
    revalidatePath("/employeedashboard/village/member");
    return { success: true, message: "Member added successfully" };
  } catch (error) {
    console.error("Error adding member:", error);
    return { success: false, message: "Failed to add member" };
  }
}

export async function getMouzaList(financialYear: string) {
  try {
    // financialYear is kept in the signature because callers are year-wise,
    // but Mouza/JL are GP-level master data, so we ignore the year here.
    return await db.mouzaname.findMany();
  } catch (error) {
    console.error("Error fetching mouza list:", error);
    return [];
  }
}

export async function addVoterSummary(formData: FormData) {
  const financialYear = formData.get("financialYear") as string;
  const mouzaId = formData.get("mouzaId") as string;
  const data: any = { financialYear, mouzaId };

  ["totalMaleVoter", "totalFemaleVoter", "scMaleVoter", "scFemaleVoter", "stMaleVoter", "stFemaleVoter", "obcMaleVoter", "obcFemaleVoter", "genMaleVoter", "genFemaleVoter"].forEach(field => {
    data[field] = parseInt(formData.get(field) as string) || 0;
  });

  try {
    await db.voterSummary.create({ data });
    revalidatePath("/employeedashboard/village/voter");
    return { success: true, message: "Voter summary added successfully" };
  } catch (error) {
    console.error("Error adding voter summary:", error);
    return { success: false, message: "Failed to add voter summary" };
  }
}

export async function addToiletSummary(formData: FormData) {
  const financialYear = formData.get("financialYear") as string;
  const mouzaId = formData.get("mouzaId") as string;
  const totalHousehold = parseInt(formData.get("totalHousehold") as string) || 0;
  const toiletAvailable = parseInt(formData.get("toiletAvailable") as string) || 0;
  const toiletNotAvailable = parseInt(formData.get("toiletNotAvailable") as string) || 0;

  try {
    await db.toiletSummary.create({
      data: { financialYear, mouzaId, totalHousehold, toiletAvailable, toiletNotAvailable }
    });
    revalidatePath("/employeedashboard/village/toilet");
    return { success: true, message: "Toilet summary added successfully" };
  } catch (error) {
    console.error("Error adding toilet summary:", error);
    return { success: false, message: "Failed to add toilet summary" };
  }
}

export async function addWaterSummary(formData: FormData) {
  const financialYear = formData.get("financialYear") as string;
  const mouzaId = formData.get("mouzaId") as string;
  const data: any = { financialYear, mouzaId };

  ["tapWater", "handPump", "well", "pond", "other"].forEach(field => {
    data[field] = parseInt(formData.get(field) as string) || 0;
  });

  try {
    await db.waterSummary.create({ data });
    revalidatePath("/employeedashboard/village/water");
    return { success: true, message: "Water summary added successfully" };
  } catch (error) {
    console.error("Error adding water summary:", error);
    return { success: false, message: "Failed to add water summary" };
  }
}

export async function addEducationSummary(formData: FormData) {
  const financialYear = formData.get("financialYear") as string;
  const mouzaId = formData.get("mouzaId") as string;
  const data: any = { financialYear, mouzaId };

  ["illiterate", "primary", "secondary", "higher", "graduate"].forEach(field => {
    data[field] = parseInt(formData.get(field) as string) || 0;
  });

  try {
    await db.educationSummary.create({ data });
    revalidatePath("/employeedashboard/village/education");
    return { success: true, message: "Education summary added successfully" };
  } catch (error) {
    console.error("Error adding education summary:", error);
    return { success: false, message: "Failed to add education summary" };
  }
}

export async function addPopulationSummary(formData: FormData) {
  const financialYear = formData.get("financialYear") as string;
  const mouzaId = formData.get("mouzaId") as string;
  const data: any = { financialYear, mouzaId };

  ["totalMale", "totalFemale", "scMale", "scFemale", "stMale", "stFemale", "obcMale", "obcFemale", "genMale", "genFemale"].forEach(field => {
    data[field] = parseInt(formData.get(field) as string) || 0;
  });

  try {
    await db.populationSummary.create({ data });
    revalidatePath("/employeedashboard/village/population-summary");
    return { success: true, message: "Population summary added successfully" };
  } catch (error) {
    console.error("Error adding population summary:", error);
    return { success: false, message: "Failed to add population summary" };
  }
}

export async function updateMouza(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const jlno = formData.get("jlno") as string;
  const totalHouseholdsStr = formData.get("totalHouseholds") as string;
  const totalHouseholds = totalHouseholdsStr ? parseInt(totalHouseholdsStr) : undefined;
  try {
    const current = await db.mouzaname.findUnique({
      where: { id },
      select: { jlno: true },
    });
    if (!current) {
      return { success: false, message: "Mouza not found" };
    }

    // Mouza + JL No are fixed master data; update across all FY rows by JL No.
    await db.mouzaname.updateMany({
      where: { jlno: current.jlno },
      data: { name, jlno, totalHouseholds },
    });
    revalidatePath("/employeedashboard/village/mouza");
    revalidatePath("/employeedashboard/village/view");
    return { success: true, message: "Mouza updated successfully" };
  } catch (error) {
    console.error("Error updating Mouza:", error);
    return { success: false, message: "Failed to update Mouza" };
  }
}

export async function getVillageOverview(financialYear: string) {
  try {
    const mouzas = await db.mouzaname.findMany({
      select: { id: true, name: true, jlno: true, totalHouseholds: true },
    });
    const results = await Promise.all(
      mouzas.map(async (m) => {
        const householdCount = m.totalHouseholds || 0;
        const populationRecords = await db.population.findMany({
          where: { financialYear, mouzaId: m.id },
          select: { male: true, female: true },
        });
        const totalPopulation = populationRecords.reduce(
          (sum, r) => sum + (r.male || 0) + (r.female || 0),
          0
        );
        const water = await db.waterSummary.findFirst({
          where: { financialYear, mouzaId: m.id },
          select: { tapWater: true, handPump: true, well: true, pond: true, other: true },
        });
        const toilet = await db.toiletSummary.findFirst({
          where: { financialYear, mouzaId: m.id },
          select: { totalHousehold: true, toiletAvailable: true, toiletNotAvailable: true },
        });
        return {
          id: m.id,
          name: m.name,
          jlno: m.jlno,
          householdCount,
          totalPopulation,
          water,
          toilet,
        };
      })
    );
    return { success: true, data: results, message: "Overview fetched" };
  } catch (error) {
    console.error("Error fetching village overview:", error);
    return { success: false, message: "Failed to fetch village overview", data: [] };
  }
}

export async function getVillageDetails(mouzaId: string, financialYear: string) {
  try {
    const mouza = await db.mouzaname.findUnique({
      where: { id: mouzaId },
      select: { id: true, name: true, jlno: true, totalHouseholds: true },
    });
    const households = mouza?.totalHouseholds || 0;
    const population = await db.population.findFirst({
      where: { financialYear, mouzaId },
    });
    const voter = await db.voterSummary.findFirst({
      where: { financialYear, mouzaId },
    });
    const water = await db.waterSummary.findFirst({
      where: { financialYear, mouzaId },
    });
    const toilet = await db.toiletSummary.findFirst({
      where: { financialYear, mouzaId },
    });
    const education = await db.educationSummary.findFirst({
      where: { financialYear, mouzaId },
    });
    return {
      success: true,
      data: { mouza, households, population, voter, water, toilet, education },
      message: "Details fetched",
    };
  } catch (error) {
    console.error("Error fetching village details:", error);
    return { success: false, message: "Failed to fetch village details" };
  }
}

export async function deleteMouza(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    const current = await db.mouzaname.findUnique({
      where: { id },
      select: { jlno: true },
    });
    if (!current) {
      return { success: false, message: "Mouza not found" };
    }

    // Mouza is master data; delete across all FY rows by JL No.
    await db.mouzaname.deleteMany({ where: { jlno: current.jlno } });
    revalidatePath("/employeedashboard/village/mouza");
    revalidatePath("/employeedashboard/village/view");
    return { success: true, message: "Mouza deleted successfully" };
  } catch (error) {
    console.error("Error deleting Mouza:", error);
    return { success: false, message: "Failed to delete Mouza" };
  }
}

// === MEMBER ===
export async function getMemberList(financialYear: string) {
  try {
    return await db.member.findMany({
      where: { financialYear }
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function updateMember(formData: FormData) {
  const id = formData.get("id") as string;
  const data: any = {};
  formData.forEach((value, key) => {
    if (key !== "id") {
      if (key === "dob") {
        data[key] = new Date(value as string);
      } else {
        data[key] = value;
      }
    }
  });

  try {
    await db.member.update({ where: { id }, data });
    revalidatePath("/employeedashboard/village/member");
    return { success: true, message: "Member updated successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to update member" };
  }
}

export async function deleteMember(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await db.member.delete({ where: { id } });
    revalidatePath("/employeedashboard/village/member");
    return { success: true, message: "Member deleted successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to delete member" };
  }
}

export async function getWaterSummary(mouzaId: string, financialYear: string) {
  try {
    return await db.waterSummary.findFirst({
      where: { mouzaId, financialYear },
    });
  } catch (error) {
    console.error("Error fetching water summary:", error);
    return null;
  }
}

// === WATER SUMMARY ===
export async function getWaterSummaryList(financialYear: string) {
  try {
    return await db.waterSummary.findMany({
      where: { financialYear },
      include: { mouza: true }
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function updateWaterSummary(formData: FormData) {
  const id = formData.get("id") as string;
  const data: any = {};
  ["tapWater", "handPump", "well", "pond", "other"].forEach(field => {
    data[field] = parseInt(formData.get(field) as string) || 0;
  });

  try {
    await db.waterSummary.update({ where: { id }, data });
    revalidatePath("/employeedashboard/village/water");
    return { success: true, message: "Water summary updated successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to update water summary" };
  }
}

export async function deleteWaterSummary(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await db.waterSummary.delete({ where: { id } });
    revalidatePath("/employeedashboard/village/water");
    return { success: true, message: "Water summary deleted successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to delete water summary" };
  }
}

export async function getToiletSummary(mouzaId: string, financialYear: string) {
  try {
    return await db.toiletSummary.findFirst({
      where: { mouzaId, financialYear },
    });
  } catch (error) {
    console.error("Error fetching toilet summary:", error);
    return null;
  }
}

// === TOILET SUMMARY ===
export async function getToiletSummaryList(financialYear: string) {
  try {
    return await db.toiletSummary.findMany({
      where: { financialYear },
      include: { mouza: true }
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function updateToiletSummary(formData: FormData) {
  const id = formData.get("id") as string;
  const totalHousehold = parseInt(formData.get("totalHousehold") as string) || 0;
  const toiletAvailable = parseInt(formData.get("toiletAvailable") as string) || 0;
  const toiletNotAvailable = parseInt(formData.get("toiletNotAvailable") as string) || 0;

  try {
    await db.toiletSummary.update({
      where: { id },
      data: { totalHousehold, toiletAvailable, toiletNotAvailable }
    });
    revalidatePath("/employeedashboard/village/toilet");
    return { success: true, message: "Toilet summary updated successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to update toilet summary" };
  }
}

export async function deleteToiletSummary(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await db.toiletSummary.delete({ where: { id } });
    revalidatePath("/employeedashboard/village/toilet");
    return { success: true, message: "Toilet summary deleted successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to delete toilet summary" };
  }
}

export async function getEducationSummary(mouzaId: string, financialYear: string) {
  try {
    return await db.educationSummary.findFirst({
      where: { mouzaId, financialYear },
    });
  } catch (error) {
    console.error("Error fetching education summary:", error);
    return null;
  }
}

// === EDUCATION SUMMARY ===
export async function getEducationSummaryList(financialYear: string) {
  try {
    return await db.educationSummary.findMany({
      where: { financialYear },
      include: { mouza: true }
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function updateEducationSummary(formData: FormData) {
  const id = formData.get("id") as string;
  const data: any = {};
  ["illiterate", "primary", "secondary", "higher", "graduate"].forEach(field => {
    data[field] = parseInt(formData.get(field) as string) || 0;
  });

  try {
    await db.educationSummary.update({ where: { id }, data });
    revalidatePath("/employeedashboard/village/education");
    return { success: true, message: "Education summary updated successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to update education summary" };
  }
}

export async function deleteEducationSummary(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await db.educationSummary.delete({ where: { id } });
    revalidatePath("/employeedashboard/village/education");
    return { success: true, message: "Education summary deleted successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to delete education summary" };
  }
}

export async function getVoterSummary(mouzaId: string, financialYear: string) {
  try {
    return await db.voterSummary.findFirst({
      where: { mouzaId, financialYear },
    });
  } catch (error) {
    console.error("Error fetching voter summary:", error);
    return null;
  }
}

// === VOTER SUMMARY ===
export async function getVoterSummaryList(financialYear: string) {
  try {
    return await db.voterSummary.findMany({
      where: { financialYear },
      include: { mouza: true }
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function updateVoterSummary(formData: FormData) {
  const id = formData.get("id") as string;
  const data: any = {};
  ["totalMaleVoter", "totalFemaleVoter", "scMaleVoter", "scFemaleVoter", "stMaleVoter", "stFemaleVoter", "obcMaleVoter", "obcFemaleVoter", "genMaleVoter", "genFemaleVoter"].forEach(field => {
    data[field] = parseInt(formData.get(field) as string) || 0;
  });

  try {
    await db.voterSummary.update({ where: { id }, data });
    revalidatePath("/employeedashboard/village/voter");
    return { success: true, message: "Voter summary updated successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to update voter summary" };
  }
}

export async function deleteVoterSummary(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await db.voterSummary.delete({ where: { id } });
    revalidatePath("/employeedashboard/village/voter");
    return { success: true, message: "Voter summary deleted successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to delete voter summary" };
  }
}

// === POPULATION ===
export async function getPopulationList(financialYear: string) {
  try {
    return await db.population.findMany({
      where: { financialYear },
      include: { mouza: true }
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function updatePopulation(formData: FormData) {
  const id = formData.get("id") as string;
  const data: any = {};
  ["male", "female", "st", "sc", "obc", "other", "hindu", "muslim", "christian", "otherReligion"].forEach(field => {
    data[field] = parseInt(formData.get(field) as string) || 0;
  });

  try {
    await db.population.update({ where: { id }, data });
    revalidatePath("/employeedashboard/village/population");
    return { success: true, message: "Population details updated successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to update population details" };
  }
}

export async function deletePopulation(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await db.population.delete({ where: { id } });
    revalidatePath("/employeedashboard/village/population");
    return { success: true, message: "Population details deleted successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to delete population details" };
  }
}

// === POPULATION SUMMARY ===
export async function getPopulationSummary(mouzaId: string, financialYear: string) {
  try {
    return await db.populationSummary.findFirst({
      where: { mouzaId, financialYear },
    });
  } catch (error) {
    console.error("Error fetching population summary:", error);
    return null;
  }
}

export async function getPopulationSummaryList(financialYear: string) {
  try {
    return await db.populationSummary.findMany({
      where: { financialYear },
      include: { mouza: true }
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function updatePopulationSummary(formData: FormData) {
  const id = formData.get("id") as string;
  const data: any = {};
  ["totalMale", "totalFemale", "scMale", "scFemale", "stMale", "stFemale", "obcMale", "obcFemale", "genMale", "genFemale"].forEach(field => {
    data[field] = parseInt(formData.get(field) as string) || 0;
  });

  try {
    await db.populationSummary.update({ where: { id }, data });
    revalidatePath("/employeedashboard/village/population-summary");
    return { success: true, message: "Population summary updated successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to update population summary" };
  }
}

export async function deletePopulationSummary(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await db.populationSummary.delete({ where: { id } });
    revalidatePath("/employeedashboard/village/population-summary");
    return { success: true, message: "Population summary deleted successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to delete population summary" };
  }
}
