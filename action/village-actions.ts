"use server"

import { db } from "@/lib/db"

import { revalidatePath } from "next/cache"


// Types for form data
export interface VillageFormData {
  jlNo: string
  name: string
  state: string
  district: string
  block: string
  gramPanchayatName: string
  pincode?: string
  households: number
}

export interface YearlyPopulationFormData {
  villageId: string
  year: number
  totalPopulation: number
  malePopulation: number
  femalePopulation: number
  totalLiterate: number
  maleLiterate: number
  femaleLiterate: number
  scPopulation: number
  stPopulation: number
  obcPopulation: number
  generalPopulation: number
  illiteratePopulation: number
  childPopulation: number
  adultPopulation: number
  seniorPopulation: number
  workingPopulation: number
}

export interface EducationalInstitutionFormData {
  villageId: string
  year: number
  ssk: number
  anganwadi: number
  primarySchool: number
  upperPrimary: number
  highSchool: number
  higherSecondary: number
  madrasah: number
  juniorHigh: number
  college: number
  university: number
  technicalInstitute: number
  vocationalCenter: number
  adultEducationCenter: number
  libraryCount: number
  computerCenter: number
}

// Village Actions
export async function createVillage(data: VillageFormData) {
  try {
    const village = await db.village.create({
      data: {
        jlNo: data.jlNo,
        name: data.name,
        state: data.state,
        district: data.district,
        block: data.block,
        gramPanchayatName: data.gramPanchayatName,
        pincode: data.pincode,
        households: data.households,
      },
    })

   

    revalidatePath("/villages")
    return { success: true, data: village }
  } catch (error) {
    console.error("Error creating village:", error)
    return { success: false, error: "Failed to create village" }
  }
}

export async function updateVillage(id: string, data: Partial<VillageFormData>) {
  try {
    const existingVillage = await db.village.findUnique({
      where: { id },
    })

    if (!existingVillage) {
      return { success: false, error: "Village not found" }
    }

    const village = await db.village.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

   

    revalidatePath("/villages")
    return { success: true, data: village }
  } catch (error) {
    console.error("Error updating village:", error)
    return { success: false, error: "Failed to update village" }
  }
}

export async function deleteVillage(id: string) {
  try {
    const existingVillage = await db.village.findUnique({
      where: { id },
    })

    if (!existingVillage) {
      return { success: false, error: "Village not found" }
    }

    await db.village.delete({
      where: { id },
    })

    

    revalidatePath("/villages")
    return { success: true }
  } catch (error) {
    console.error("Error deleting village:", error)
    return { success: false, error: "Failed to delete village" }
  }
}

export async function getVillages() {
  try {
    const villages = await db.village.findMany({
      include: {
        yearlyData: {
          orderBy: { year: "desc" },
          take: 1, // Get latest year data
        },
        educationalInstitutionData: {
          orderBy: { year: "desc" },
          take: 1,
        },
        villageInfrastructure: {
          orderBy: { year: "desc" },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    })

    return { success: true, data: villages }
  } catch (error) {
    console.error("Error fetching villages:", error)
    return { success: false, error: "Failed to fetch villages" }
  }
}

export async function getVillageById(id: string) {
  try {
    const village = await db.village.findUnique({
      where: { id },
      include: {
        yearlyData: {
          orderBy: { year: "desc" },
        },
        educationalInstitutionData: {
          orderBy: { year: "desc" },
        },
        villageInfrastructure: {
          orderBy: { year: "desc" },
        },
        villageEducation: {
          orderBy: { year: "desc" },
        },
        healthData: {
          orderBy: { year: "desc" },
        },
        sanitationData: {
          orderBy: { year: "desc" },
        },
        waterSupplyData: {
          orderBy: { year: "desc" },
        },
        economicData: {
          orderBy: { year: "desc" },
        },
      },
    })

    if (!village) {
      return { success: false, error: "Village not found" }
    }

    return { success: true, data: village }
  } catch (error) {
    console.error("Error fetching village:", error)
    return { success: false, error: "Failed to fetch village" }
  }
}

// Population Data Actions
export async function createOrUpdateYearlyPopulationData(data: YearlyPopulationFormData) {
  try {
    const yearlyData = await db.yearlyPopulationData.upsert({
      where: {
        villageId_year: {
          villageId: data.villageId,
          year: data.year,
        },
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: data,
    })

    

    revalidatePath("/villages")
    return { success: true, data: yearlyData }
  } catch (error) {
    console.error("Error saving population data:", error)
    return { success: false, error: "Failed to save population data" }
  }
}

export async function verifyPopulationData(id: string, verifiedBy: string) {
  try {
    const yearlyData = await db.yearlyPopulationData.update({
      where: { id },
      data: {
        verified: true,
        verifiedBy,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      },
    })

   

    revalidatePath("/villages")
    return { success: true, data: yearlyData }
  } catch (error) {
    console.error("Error verifying population data:", error)
    return { success: false, error: "Failed to verify population data" }
  }
}

// Educational Institution Actions
export async function createOrUpdateEducationalInstitutionData(data: EducationalInstitutionFormData) {
  try {
    const educationalData = await db.educationalInstitutionData.upsert({
      where: {
        villageId_year: {
          villageId: data.villageId,
          year: data.year,
        },
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: data,
    })

    revalidatePath("/villages")
    return { success: true, data: educationalData }
  } catch (error) {
    console.error("Error saving educational data:", error)
    return { success: false, error: "Failed to save educational data" }
  }
}

// Infrastructure Actions
export async function createOrUpdateInfrastructureData(data: any) {
  try {
    const infrastructureData = await db.villageInfrastructure.upsert({
      where: {
        villageId_year: {
          villageId: data.villageId,
          year: data.year,
        },
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: data,
    })

    

    revalidatePath("/villages")
    return { success: true, data: infrastructureData }
  } catch (error) {
    console.error("Error saving infrastructure data:", error)
    return { success: false, error: "Failed to save infrastructure data" }
  }
}

// Health Data Actions
export async function createOrUpdateHealthData(data: any) {
  try {
    const healthData = await db.healthData.upsert({
      where: {
        villageId_year: {
          villageId: data.villageId,
          year: data.year,
        },
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: data,
    })

   

    revalidatePath("/villages")
    return { success: true, data: healthData }
  } catch (error) {
    console.error("Error saving health data:", error)
    return { success: false, error: "Failed to save health data" }
  }
}

// Sanitation Data Actions
export async function createOrUpdateSanitationData(data: any) {
  try {
    const sanitationData = await db.sanitationData.upsert({
      where: {
        villageId_year: {
          villageId: data.villageId,
          year: data.year,
        },
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: data,
    })

   

    revalidatePath("/villages")
    return { success: true, data: sanitationData }
  } catch (error) {
    console.error("Error saving sanitation data:", error)
    return { success: false, error: "Failed to save sanitation data" }
  }
}

// Water Supply Data Actions
export async function createOrUpdateWaterSupplyData(data: any) {
  try {
    const waterSupplyData = await db.waterSupplyData.upsert({
      where: {
        villageId_year: {
          villageId: data.villageId,
          year: data.year,
        },
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: data,
    })

   

    revalidatePath("/villages")
    return { success: true, data: waterSupplyData }
  } catch (error) {
    console.error("Error saving water supply data:", error)
    return { success: false, error: "Failed to save water supply data" }
  }
}

// Economic Data Actions
export async function createOrUpdateEconomicData(data: any) {
  try {
    const economicData = await db.economicData.upsert({
      where: {
        villageId_year: {
          villageId: data.villageId,
          year: data.year,
        },
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: data,
    })

    

    revalidatePath("/villages")
    return { success: true, data: economicData }
  } catch (error) {
    console.error("Error saving economic data:", error)
    return { success: false, error: "Failed to save economic data" }
  }
}

// Bulk Data Operations
export async function bulkCreateVillages(villages: VillageFormData[]) {
  try {
    const result = await db.village.createMany({
      data: villages,
      
    })

   

    revalidatePath("/villages")
    return { success: true, data: result }
  } catch (error) {
    console.error("Error bulk creating villages:", error)
    return { success: false, error: "Failed to bulk create villages" }
  }
}

// Search and Filter Functions
export async function searchVillages(query: string) {
  try {
    const villages = await db.village.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { jlNo: { contains: query, mode: "insensitive" } },
          { district: { contains: query, mode: "insensitive" } },
          { state: { contains: query, mode: "insensitive" } },
          { block: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        yearlyData: {
          orderBy: { year: "desc" },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    })

    return { success: true, data: villages }
  } catch (error) {
    console.error("Error searching villages:", error)
    return { success: false, error: "Failed to search villages" }
  }
}

export async function getVillagesByDistrict(district: string) {
  try {
    const villages = await db.village.findMany({
      where: { district },
      include: {
        yearlyData: {
          orderBy: { year: "desc" },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    })

    return { success: true, data: villages }
  } catch (error) {
    console.error("Error fetching villages by district:", error)
    return { success: false, error: "Failed to fetch villages by district" }
  }
}

// Analytics Functions
export async function getVillageStatistics() {
  try {
    const totalVillages = await db.village.count()
    const totalPopulation = await db.yearlyPopulationData.aggregate({
      _sum: { totalPopulation: true },
      where: { year: new Date().getFullYear() },
    })
    const totalHouseholds = await db.village.aggregate({
      _sum: { households: true },
    })

    const districtWiseCount = await db.village.groupBy({
      by: ["district"],
      _count: { district: true },
      orderBy: { _count: { district: "desc" } },
    })

    return {
      success: true,
      data: {
        totalVillages,
        totalPopulation: totalPopulation._sum.totalPopulation || 0,
        totalHouseholds: totalHouseholds._sum.households || 0,
        districtWiseCount,
      },
    }
  } catch (error) {
    console.error("Error fetching village statistics:", error)
    return { success: false, error: "Failed to fetch village statistics" }
  }
}
