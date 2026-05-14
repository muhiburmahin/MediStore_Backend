import { z } from "zod/v3";

export const wishlistAddSchema = z.object({
  body: z.object({
    medicineId: z.string().min(1),
  }),
});

export const wishlistToggleSchema = wishlistAddSchema;

export const wishlistMedicineIdParamValidation = z.object({
  params: z.object({
    medicineId: z.string().min(1, "medicineId is required"),
  }),
});

export const wishlistEntryIdParamValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Wishlist entry id is required"),
  }),
});
