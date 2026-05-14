import { z } from "zod/v3";

export const createCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    imageUrl: z.string().url("Must be a valid URL").optional(),
  }),
});

export const updateCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    imageUrl: z.string().url("Must be a valid URL").optional(),
  }),
});

export const categoryIdParamValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Category id is required"),
  }),
});
