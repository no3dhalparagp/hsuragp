import * as z from "zod";

export const mouzaSchema = z.object({
  name: z.string().min(1, "Mouza name is required"),
  jlno: z.string().min(1, "J.L. No. is required"),
  financialYear: z.string().min(1, "Financial year is required"),
  totalHouseholds: z.coerce.number().int().nonnegative().optional(),
});

export const sansadSchema = z.object({
  sansadname: z.string().min(1, "Sansad name is required"),
  sansadnumber: z.string().min(1, "Sansad number is required"),
  financialYear: z.string().min(1, "Financial year is required"),
});

export const populationSchema = z.object({
  financialYear: z.string().min(1, "Financial year is required"),
  mouzaId: z.string().min(1, "Mouza selection is required"),
  male: z.coerce.number().int().nonnegative(),
  female: z.coerce.number().int().nonnegative(),
  st: z.coerce.number().int().nonnegative(),
  sc: z.coerce.number().int().nonnegative(),
  obc: z.coerce.number().int().nonnegative(),
  other: z.coerce.number().int().nonnegative(),
  hindu: z.coerce.number().int().nonnegative(),
  muslim: z.coerce.number().int().nonnegative(),
  christian: z.coerce.number().int().nonnegative(),
  otherReligion: z.coerce.number().int().nonnegative(),
});

export const populationSummarySchema = z.object({
  financialYear: z.string().min(1, "Financial year is required"),
  mouzaId: z.string().min(1, "Mouza selection is required"),
  totalMale: z.coerce.number().int().nonnegative(),
  totalFemale: z.coerce.number().int().nonnegative(),
  scMale: z.coerce.number().int().nonnegative(),
  scFemale: z.coerce.number().int().nonnegative(),
  stMale: z.coerce.number().int().nonnegative(),
  stFemale: z.coerce.number().int().nonnegative(),
  obcMale: z.coerce.number().int().nonnegative(),
  obcFemale: z.coerce.number().int().nonnegative(),
  genMale: z.coerce.number().int().nonnegative(),
  genFemale: z.coerce.number().int().nonnegative(),
});

export const voterSummarySchema = z.object({
  financialYear: z.string().min(1, "Financial year is required"),
  mouzaId: z.string().min(1, "Mouza selection is required"),
  totalMaleVoter: z.coerce.number().int().nonnegative(),
  totalFemaleVoter: z.coerce.number().int().nonnegative(),
  scMaleVoter: z.coerce.number().int().nonnegative(),
  scFemaleVoter: z.coerce.number().int().nonnegative(),
  stMaleVoter: z.coerce.number().int().nonnegative(),
  stFemaleVoter: z.coerce.number().int().nonnegative(),
  obcMaleVoter: z.coerce.number().int().nonnegative(),
  obcFemaleVoter: z.coerce.number().int().nonnegative(),
  genMaleVoter: z.coerce.number().int().nonnegative(),
  genFemaleVoter: z.coerce.number().int().nonnegative(),
});

export const toiletSummarySchema = z.object({
  financialYear: z.string().min(1, "Financial year is required"),
  mouzaId: z.string().min(1, "Mouza selection is required"),
  totalHousehold: z.coerce.number().int().nonnegative(),
  toiletAvailable: z.coerce.number().int().nonnegative(),
  toiletNotAvailable: z.coerce.number().int().nonnegative(),
});

export const waterSummarySchema = z.object({
  financialYear: z.string().min(1, "Financial year is required"),
  mouzaId: z.string().min(1, "Mouza selection is required"),
  tapWater: z.coerce.number().int().nonnegative(),
  handPump: z.coerce.number().int().nonnegative(),
  well: z.coerce.number().int().nonnegative(),
  pond: z.coerce.number().int().nonnegative(),
  other: z.coerce.number().int().nonnegative(),
});

export const educationSummarySchema = z.object({
  financialYear: z.string().min(1, "Financial year is required"),
  mouzaId: z.string().min(1, "Mouza selection is required"),
  illiterate: z.coerce.number().int().nonnegative(),
  primary: z.coerce.number().int().nonnegative(),
  secondary: z.coerce.number().int().nonnegative(),
  higher: z.coerce.number().int().nonnegative(),
  graduate: z.coerce.number().int().nonnegative(),
});

export const memberSchema = z.object({
  financialYear: z.string().min(1, "Financial year is required"),
  salutation: z.string().min(1, "Salutation is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  religion: z.string().min(1, "Religion is required"),
  aadhar: z.string().length(12, "Aadhar number must be 12 digits"),
  email: z.string().email("Invalid email address"),
  contactNo: z.string().min(10, "Contact number must be at least 10 digits"),
  eduQualification: z.string().min(1, "Education qualification is required"),
  profession: z.string().min(1, "Profession is required"),
  address: z.string().min(1, "Address is required"),
  village: z.string().min(1, "Village is required"),
  pin: z.string().length(6, "PIN code must be 6 digits"),
});
