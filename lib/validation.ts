import { z } from "zod"

export const fetchApprovedActionPlansSchema = z.object({
  financialYear: z.string().optional(),
  searchTerm: z.string().optional().default(""),
  page: z.number().min(1).optional().default(1),
  pageSize: z.number().min(1).max(100).optional().default(20),
})

export const updateActionPlanParamsSchema = z.object({
  id: z.string().uuid("Invalid action plan ID"),
  data: z.object({
    // Add your actionplanschema fields here
    activityName: z.string().min(1, "Activity name is required"),
    schemeName: z.string().min(1, "Scheme name is required"),
    estimatedCost: z.string().min(1, "Estimated cost is required"),
    locationofAsset: z.string().min(1, "Location is required"),
    financialYear: z.string().min(1, "Financial year is required"),
    // Add other fields as needed
  }),
})
