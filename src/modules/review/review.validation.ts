import { z } from "zod/v3";

export const createReviewValidation = z.object({
  body: z.object({
    comment: z.string().optional(),
    rating: z.coerce.number().int().min(1).max(5),
    medicineId: z.string().min(1),
  }),
});

export const updateReviewValidation = z.object({
  body: z.object({
    comment: z.string().optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
  }),
});

export const reviewMedicineIdParamValidation = z.object({
  params: z.object({
    medicineId: z.string().min(1, "medicineId is required"),
  }),
});

export const reviewAvgIdParamValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Medicine id is required"),
  }),
});
