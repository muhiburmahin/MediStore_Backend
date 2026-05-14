import { z } from "zod/v3";

const RoleEnum = z.enum(["CUSTOMER", "SELLER", "ADMIN"]);
const UserStatusEnum = z.enum(["ACTIVE", "BANNED"]);

/** PATCH /api/user/update/:id — body; admin may also send role/status */
export const patchUserProfileValidation = z.object({
  params: z.object({
    id: z.string().min(1, "User id is required"),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional().nullable(),
    image: z.string().optional(),
    role: RoleEnum.optional(),
    status: UserStatusEnum.optional(),
  }),
});

/** PATCH /api/admin/users/:id — same shape as profile patch */
export const adminPatchUserValidation = patchUserProfileValidation;
