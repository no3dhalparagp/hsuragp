import * as z from "zod";
export const vendorSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  mobileNumber: z.string().optional(),
  email: z.string().email().optional(),
  pan: z.string().optional(),
  tin: z.string().optional(),
  gst: z.string().optional(),
  postalAddress: z.string().min(5, {
    message: "Postal address must be at least 5 characters.",
  }),
});
