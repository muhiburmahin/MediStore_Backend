import { z } from "zod/v3";

export const createMedicineValidation = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().min(1),
    price: z.coerce.number().positive(),
    stock: z.coerce.number().int().nonnegative(),
    manufacturer: z.string().min(1),
    images: z.any().optional(),
    categoryId: z.string().min(1),
  }),
});

export const updateMedicineValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    stock: z.coerce.number().int().nonnegative().optional(),
    manufacturer: z.string().optional(),
    images: z.any().optional(),
    categoryId: z.string().min(1).optional(),
  }),
});

export const medicineListQueryValidation = z.object({
  query: z.object({
    search: z.string().optional(),
    categoryId: z.string().optional(),
    sellerId: z.string().optional(),
    category: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.string().optional(),
    dashboard: z.enum(["true", "false"]).optional(),
  }),
});

export const medicineIdParamValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Medicine id is required"),
  }),
});

export const updateMedicineWithParamsValidation = updateMedicineValidation.and(medicineIdParamValidation);
