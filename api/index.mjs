// src/app.ts
import express6 from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel category {\n  id        String     @id @default(uuid())\n  name      String     @unique\n  imageUrl  String?\n  medicine  medicine[]\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n\n  @@index([name])\n}\n\nmodel medicine {\n  id           String @id @default(uuid())\n  name         String\n  description  String\n  price        Float\n  stock        Int\n  manufacturer String\n\n  images String[]\n\n  categoryId String\n  category   category @relation(fields: [categoryId], references: [id])\n\n  sellerId String\n  seller   User   @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n\n  orderItems orderItem[]\n  reviews    review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([name])\n}\n\nmodel order {\n  id         String @id @default(uuid())\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Cascade)\n\n  status          orderStatus @default(PLACED)\n  shippingAddress String\n  phone           String?\n  totalAmount     Float\n\n  items orderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel orderItem {\n  id String @id @default(uuid())\n\n  orderId String\n  order   order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  medicineId String\n  medicine   medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  quantity Int\n  price    Float\n\n  createdAt DateTime @default(now())\n}\n\nmodel review {\n  id      String  @id @default(uuid())\n  comment String?\n  rating  Int\n\n  medicineId String\n  medicine   medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  userId     String\n  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdat  DateTime @default(now())\n\n  @@unique([userId, medicineId])\n}\n\nenum orderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  reviews   review[]\n  orders    order[]    @relation("CustomerOrders")\n  medicines medicine[]\n\n  role   String @default("CUSTOMER")\n  status String @default("ACTIVE")\n\n  phone String?\n\n  @@unique([email])\n  @@map("user")\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"medicine","relationName":"categoryTomedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"category","relationName":"categoryTomedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"UserTomedicine"},{"name":"orderItems","kind":"object","type":"orderItem","relationName":"medicineToorderItem"},{"name":"reviews","kind":"object","type":"review","relationName":"medicineToreview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"status","kind":"enum","type":"orderStatus"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"items","kind":"object","type":"orderItem","relationName":"orderToorderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"orderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"order","relationName":"orderToorderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"medicine","relationName":"medicineToorderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"medicine","relationName":"medicineToreview"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToreview"},{"name":"createdat","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"reviews","kind":"object","type":"review","relationName":"UserToreview"},{"name":"orders","kind":"object","type":"order","relationName":"CustomerOrders"},{"name":"medicines","kind":"object","type":"medicine","relationName":"UserTomedicine"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  SELLER: "SELLER",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: { enabled: false },
    disableCSRFCheck: true
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://medistore-iota.vercel.app"
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: Role.CUSTOMER,
        required: true,
        allowedValues: [Role.CUSTOMER, Role.SELLER, Role.ADMIN]
      },
      status: {
        type: "string",
        defaultValue: UserStatus.ACTIVE,
        required: true,
        allowedValues: [UserStatus.ACTIVE, UserStatus.BANNED]
      },
      phone: {
        type: "string",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  emailVerification: {
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        await transporter.sendMail({
          from: '"MediStore" <your-email@gmail.com>',
          to: user.email,
          subject: "Verify Your Email Address \u2714",
          text: `Please verify your email using this link: ${verificationUrl}`,
          html: `
            <div style="font-family: Arial, sans-serif;">
               <h2>Hello ${user.name}</h2>
               <p>Please click the button below to verify your email:</p>
               <a href="${verificationUrl}" style="background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
            </div>
          `
        });
      } catch (err) {
        console.error("Email sending failed:", err);
        throw err;
      }
    }
  }
});

// src/modules/category/category.route.ts
import express from "express";

// src/modules/category/category.service.ts
var createCategory = async (category, imageUrl) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: category
    }
  });
  if (existingCategory) {
    throw new Error("Category already exists");
  }
  return await prisma.category.create({
    data: {
      name: category,
      imageUrl: imageUrl ?? null
    }
  });
};
var getAllCategories = async () => {
  const [categories, totalCount] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.category.count()
  ]);
  return {
    categories,
    totalCount
  };
};
var deleteCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: {
      id
    }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  return await prisma.category.delete({
    where: { id }
  });
};
var categoryService = {
  createCategory,
  getAllCategories,
  deleteCategoryById
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    const result = await categoryService.createCategory(name, imageUrl);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result
    });
  } catch (err) {
    res.status(err.message === "Category already exists" ? 409 : 500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: result.categories,
      total: result.totalCount
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch categories",
      error: err.message
    });
  }
};
var deleteCategoryById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategoryById(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Failed to delete category",
      error: err.message
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  deleteCategoryById: deleteCategoryById2
};

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required"
        });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission"
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  };
};
var auth_default = auth2;

// src/modules/category/category.route.ts
var route = express.Router();
route.get("/", categoryController.getAllCategories);
route.post("/", auth_default(Role.ADMIN, Role.SELLER), categoryController.createCategory);
route.delete("/:id", auth_default(Role.ADMIN, Role.SELLER), categoryController.deleteCategoryById);
var categoryRoute = route;

// src/modules/medicine/medicien.route.ts
import express2 from "express";

// src/helpers/paginationHelper.ts
var calculatePagination = (options) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationHelpers = {
  calculatePagination
};

// src/middleware/appError.ts
var AppError = class extends Error {
  statusCode;
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/modules/medicine/medicien.service.ts
var createMedicine = async (payload) => {
  const {
    name,
    description,
    price,
    stock,
    manufacturer,
    images,
    categoryId,
    sellerId
  } = payload;
  const [isSellerExist, isCategoryExist] = await Promise.all([
    prisma.user.findUnique({ where: { id: sellerId } }),
    prisma.category.findUnique({ where: { id: categoryId } })
  ]);
  if (!isSellerExist) throw new AppError("Seller account not found.", 404);
  if (!isCategoryExist) throw new AppError("Invalid category selected.", 404);
  return await prisma.medicine.create({
    data: {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      manufacturer,
      images,
      categoryId,
      sellerId
    },
    include: {
      category: true,
      seller: { select: { id: true, name: true, email: true } }
    }
  });
};
var getAllMedicines = async (filters, options) => {
  const { search, categoryId, sellerId, category } = filters;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
  const andConditions = [];
  if (sellerId) {
    andConditions.push({ sellerId });
  }
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { manufacturer: { contains: search, mode: "insensitive" } }
      ]
    });
  }
  if (categoryId) {
    andConditions.push({ categoryId });
  }
  if (category) {
    andConditions.push({
      category: {
        name: {
          equals: category,
          mode: "insensitive"
        }
      }
    });
  }
  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.medicine.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true, email: true } },
      _count: {
        select: { reviews: true }
      }
    }
  });
  const medicinesWithRatings = await Promise.all(
    result.map(async (medicine) => {
      const aggregate = await prisma.review.aggregate({
        where: { medicineId: medicine.id },
        _avg: { rating: true }
      });
      return {
        ...medicine,
        averageRating: aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(1)) : 0,
        totalReviews: medicine._count.reviews
      };
    })
  );
  const totalCount = await prisma.medicine.count({
    where: whereConditions
  });
  return {
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    },
    data: medicinesWithRatings
  };
};
var getMedicineById = async (id) => {
  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: { id },
    include: {
      category: true,
      seller: {
        select: { name: true, email: true }
      },
      reviews: {
        include: {
          user: { select: { name: true, image: true } }
        },
        orderBy: {
          createdat: "desc"
        }
      },
      _count: {
        select: { reviews: true }
      }
    }
  });
  const aggregate = await prisma.review.aggregate({
    where: { medicineId: id },
    _avg: {
      rating: true
    }
  });
  const ratingStats = await prisma.review.groupBy({
    by: ["rating"],
    where: { medicineId: id },
    _count: {
      rating: true
    }
  });
  const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingStats.forEach((stat) => {
    starCounts[stat.rating] = stat._count.rating;
  });
  return {
    ...medicine,
    averageRating: aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(1)) : 0,
    totalReviews: medicine._count.reviews,
    starCounts
  };
};
var updateMedicineById = async (id, userId, userRole, payload) => {
  const medicineRecord = await prisma.medicine.findUniqueOrThrow({ where: { id } });
  if (userRole !== "ADMIN" && medicineRecord.sellerId !== userId) {
    throw new AppError("Unauthorized! You can only update your own products.", 403);
  }
  if (payload.price) payload.price = Number(payload.price);
  if (payload.stock) payload.stock = Number(payload.stock);
  return await prisma.medicine.update({
    where: { id },
    data: payload
  });
};
var deleteMedicineById = async (id, userId, userRole) => {
  const medicineRecord = await prisma.medicine.findUniqueOrThrow({ where: { id } });
  if (userRole !== "ADMIN" && medicineRecord.sellerId !== userId) {
    throw new AppError("Forbidden! You cannot delete someone else's product.", 403);
  }
  return await prisma.medicine.delete({ where: { id } });
};
var medicineService = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicineById,
  deleteMedicineById
};

// src/modules/medicine/medicien.controller.ts
var pick = (query, fields) => {
  const finalCriteria = {};
  fields.forEach((field) => {
    if (query && Object.hasOwnProperty.call(query, field)) {
      finalCriteria[field] = query[field];
    }
  });
  return finalCriteria;
};
var createMedicine2 = async (req, res, next) => {
  try {
    const medicineData = req.body;
    const loggedInUser = req.user;
    if (!loggedInUser || !loggedInUser.id) {
      throw new AppError("Authentication failed! Please login to your seller account.", 401);
    }
    const payloadWithSeller = {
      ...medicineData,
      sellerId: loggedInUser.id
    };
    const result = await medicineService.createMedicine(payloadWithSeller);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "New medicine has been listed successfully in the pharmacy inventory!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllMedicines2 = async (req, res, next) => {
  try {
    const filters = pick(req.query, ["search", "categoryId", "sellerId", "category"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    if (req.user && req.user.role === "SELLER" && req.query.dashboard === "true") {
      filters.sellerId = req.user.id;
    }
    const result = await medicineService.getAllMedicines(filters, options);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "All medicine records retrieved successfully from the database.",
      meta: result.meta,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};
var getMedicineById2 = async (req, res, next) => {
  try {
    const targetMedicineId = req.params.id;
    const result = await medicineService.getMedicineById(targetMedicineId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Medicine details fetched successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateMedicineById2 = async (req, res, next) => {
  try {
    const medicineId = req.params.id;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    const updatedInfo = req.body;
    const result = await medicineService.updateMedicineById(
      medicineId,
      currentUserId,
      currentUserRole,
      updatedInfo
    );
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Medicine record updated successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteMedicineById2 = async (req, res, next) => {
  try {
    const medicineId = req.params.id;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    await medicineService.deleteMedicineById(
      medicineId,
      currentUserId,
      currentUserRole
    );
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Medicine has been permanently removed from the system inventory."
    });
  } catch (error) {
    next(error);
  }
};
var medicineController = {
  createMedicine: createMedicine2,
  getAllMedicines: getAllMedicines2,
  getMedicineById: getMedicineById2,
  updateMedicineById: updateMedicineById2,
  deleteMedicineById: deleteMedicineById2
};

// src/modules/medicine/medicien.route.ts
var router = express2.Router();
router.get("/", medicineController.getAllMedicines);
router.get("/:id", medicineController.getMedicineById);
router.post("/", auth_default(Role.SELLER, Role.ADMIN), medicineController.createMedicine);
router.patch("/:id", auth_default(Role.SELLER, Role.ADMIN), medicineController.updateMedicineById);
router.delete("/:id", auth_default(Role.SELLER, Role.ADMIN), medicineController.deleteMedicineById);
var medicineRoute = router;

// src/modules/order/order.route.ts
import express3 from "express";

// src/modules/order/order.service.ts
var createOrder = async (customerId, payload) => {
  const { items, shippingAddress, phone } = payload;
  return await prisma.$transaction(async (tx) => {
    let calculatedTotalAmount = 0;
    const orderItemsData = [];
    for (const item of items) {
      const med = await tx.medicine.findUnique({
        where: { id: item.medicineId }
      });
      if (!med) throw new AppError(`Medicine not found`, 404);
      if (med.stock < item.quantity) {
        throw new AppError(`${med.name} stock is insufficient. Available: ${med.stock}`, 400);
      }
      calculatedTotalAmount += med.price * item.quantity;
      await tx.medicine.update({
        where: { id: med.id },
        data: { stock: { decrement: item.quantity } }
      });
      orderItemsData.push({
        medicineId: med.id,
        quantity: item.quantity,
        price: med.price
      });
    }
    return await tx.order.create({
      data: {
        customerId,
        shippingAddress,
        phone,
        totalAmount: calculatedTotalAmount,
        status: "PLACED",
        items: { create: orderItemsData }
      },
      include: { items: { include: { medicine: true } } }
    });
  });
};
var getSellerOrders = async (sellerId) => {
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: { sellerId }
        }
      }
    },
    include: {
      items: {
        where: {
          medicine: { sellerId }
        },
        include: { medicine: true }
      },
      customer: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return orders.map((order) => {
    const sellerOnlyTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      ...order,
      totalAmount: sellerOnlyTotal
    };
  });
};
var getMyOrders = async (customerId) => {
  return await prisma.order.findMany({
    where: { customerId },
    include: { items: { include: { medicine: true } } },
    orderBy: { createdAt: "desc" }
  });
};
var getSingleOrderById = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { medicine: true } },
      customer: { select: { name: true, email: true } }
    }
  });
  if (!order) throw new AppError("Order not found", 404);
  return order;
};
var updateOrderStatus = async (orderId, status, userId, userRole) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { medicine: true } } }
  });
  if (!order) throw new AppError("Order not found", 404);
  const isOwner = order.items.some((item) => item.medicine.sellerId === userId);
  if (userRole !== "ADMIN" && !isOwner) {
    throw new AppError("You don't have permission to update this order", 403);
  }
  return await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
};
var deleteOrderById = async (id) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError("Order not found", 404);
  return await prisma.order.delete({ where: { id } });
};
var getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      items: {
        include: { medicine: true }
      },
      customer: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var orderService = {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getSingleOrderById,
  updateOrderStatus,
  deleteOrderById,
  getAllOrders
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);
    const result = await orderService.createOrder(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getOrders = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const path2 = req.originalUrl;
    if (!userId) throw new AppError("Unauthorized", 401);
    let result;
    if (userRole === "ADMIN") {
      result = await orderService.getAllOrders();
    } else if (path2.includes("seller") && userRole === "SELLER") {
      result = await orderService.getSellerOrders(userId);
    } else {
      result = await orderService.getMyOrders(userId);
    }
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getSingleOrderById2 = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const result = await orderService.getSingleOrderById(orderId);
    res.status(200).json({
      success: true,
      message: "Order Get successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const result = await orderService.updateOrderStatus(id, status, userId, userRole);
    res.status(200).json({
      success: true,
      message: `Order status updated to successfully!`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteOrderById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await orderService.deleteOrderById(id);
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var orderController = {
  createOrder: createOrder2,
  getOrders,
  getSingleOrderById: getSingleOrderById2,
  updateStatus,
  deleteOrderById: deleteOrderById2
};

// src/modules/order/order.route.ts
var router2 = express3.Router();
router2.get("/", auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.getOrders);
router2.get("/:id", auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.getSingleOrderById);
router2.post("/", auth_default(Role.CUSTOMER, Role.SELLER), orderController.createOrder);
router2.patch("/update-status/:id", auth_default(Role.SELLER, Role.ADMIN), orderController.updateStatus);
router2.delete("/:id", auth_default(Role.ADMIN, Role.SELLER), orderController.deleteOrderById);
var orderRoutes = router2;

// src/modules/review/review.route.ts
import express4 from "express";

// src/modules/review/review.service.ts
var createReview = async (userId, payload) => {
  const { medicineId, rating, comment } = payload;
  const existingReview = await prisma.review.findFirst({
    where: { userId, medicineId }
  });
  if (existingReview) throw new AppError("You have already reviewed this medicine.", 400);
  const deliveredOrder = await prisma.order.findFirst({
    where: {
      customerId: userId,
      status: "DELIVERED",
      items: {
        some: { medicineId }
      }
    }
  });
  if (!deliveredOrder) throw new AppError("You can only review after the product is delivered.", 403);
  return await prisma.review.create({
    data: {
      rating: Number(rating),
      comment: comment || null,
      userId,
      medicineId
    }
  });
};
var getMedicineReviews = async (medicineId) => {
  return await prisma.review.findMany({
    where: { medicineId },
    include: {
      user: { select: { name: true, image: true } }
    },
    orderBy: { createdat: "desc" }
  });
};
var getSingleMedicineWithAverageRating = async (id) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: true,
      _count: { select: { reviews: true } }
    }
  });
  if (!medicine) return null;
  const [aggregate, ratingStats, reviews] = await Promise.all([
    prisma.review.aggregate({
      where: { medicineId: id },
      _avg: { rating: true }
    }),
    prisma.review.groupBy({
      by: ["rating"],
      where: { medicineId: id },
      _count: { rating: true }
    }),
    prisma.review.findMany({
      where: { medicineId: id },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdat: "desc" },
      take: 10
    })
  ]);
  const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingStats.forEach((stat) => {
    starCounts[stat.rating] = stat._count.rating;
  });
  return {
    ...medicine,
    reviews,
    averageRating: aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(1)) : 0,
    totalReviews: medicine._count.reviews,
    starCounts
  };
};
var reviewService = {
  createReview,
  getMedicineReviews,
  getSingleMedicineWithAverageRating
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await reviewService.createReview(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMedicineReviews2 = async (req, res, next) => {
  try {
    const { medicineId } = req.params;
    const result = await reviewService.getMedicineReviews(medicineId);
    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getSingleMedicineWithAverageRating2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await reviewService.getSingleMedicineWithAverageRating(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found!"
      });
    }
    res.status(200).json({
      success: true,
      message: "Medicine details retrieved successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  createReview: createReview2,
  getMedicineReviews: getMedicineReviews2,
  getSingleMedicineWithAverageRating: getSingleMedicineWithAverageRating2
};

// src/modules/review/review.route.ts
var router3 = express4.Router();
router3.get("/:medicineId", reviewController.getMedicineReviews);
router3.get("/avg/:id", reviewController.getSingleMedicineWithAverageRating);
router3.post("/", auth_default(Role.CUSTOMER), reviewController.createReview);
var reviewRoutes = router3;

// src/modules/user/user.route.ts
import express5 from "express";

// src/modules/user/user.service.ts
var getMyProfile = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true
    }
  });
};
var getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      image: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var adminStats = async () => {
  try {
    const [
      totalUser,
      customerCount,
      sellerCount,
      totalCategories,
      totalMedicines,
      totalReviews,
      totalOrders
    ] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.user.count({ where: { role: "SELLER" } }),
      prisma.category.count(),
      prisma.medicine.count(),
      prisma.review.count(),
      prisma.order.count()
    ]);
    const orderGroups = await prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { totalAmount: true }
    });
    const statusMap = {
      PLACED: { count: 0, amount: 0 },
      PROCESSING: { count: 0, amount: 0 },
      SHIPPED: { count: 0, amount: 0 },
      DELIVERED: { count: 0, amount: 0 },
      CANCELLED: { count: 0, amount: 0 }
    };
    let totalRevenue = 0;
    orderGroups.forEach((group) => {
      const statusKey = group.status?.toUpperCase();
      if (statusKey && statusMap[statusKey]) {
        statusMap[statusKey] = {
          count: group._count._all || 0,
          amount: group._sum.totalAmount || 0
        };
        if (statusKey === "DELIVERED") {
          totalRevenue = group._sum.totalAmount || 0;
        }
      }
    });
    return {
      success: true,
      stats: {
        revenue: totalRevenue,
        users: { total: totalUser, customers: customerCount, sellers: sellerCount },
        inventory: { medicines: totalMedicines, categories: totalCategories },
        orders: {
          total: totalOrders,
          statusSummary: statusMap
        },
        reviews: totalReviews
      }
    };
  } catch (error) {
    console.error("Admin stats error:", error);
    return { success: false, message: "Failed to fetch stats" };
  }
};
var sellerStats = async (sellerId) => {
  const myMedicinesCount = await prisma.medicine.count({
    where: { sellerId }
  });
  const myOrdersCount = await prisma.order.count({
    where: {
      items: {
        some: {
          medicine: { sellerId }
        }
      }
    }
  });
  const sellerOrderItems = await prisma.orderItem.findMany({
    where: {
      medicine: { sellerId }
    },
    select: {
      order: {
        select: { status: true }
      }
    }
  });
  const statusCounts = {
    placed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };
  sellerOrderItems.forEach((item) => {
    const status = item.order.status.toLowerCase();
    if (statusCounts[status] !== void 0) {
      statusCounts[status]++;
    }
  });
  const deliveredItems = await prisma.orderItem.findMany({
    where: {
      medicine: { sellerId },
      order: { status: "DELIVERED" }
    },
    select: {
      price: true,
      quantity: true
    }
  });
  const totalRevenue = deliveredItems.reduce((sum, item) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    return sum + itemTotal;
  }, 0);
  const myReviewsCount = await prisma.review.count({
    where: {
      medicine: { sellerId }
    }
  });
  const myCategoriesCount = await prisma.category.count({
    where: {
      medicine: { some: { sellerId } }
    }
  });
  return {
    category: { total: myCategoriesCount },
    medicine: { total: myMedicinesCount },
    order: {
      total: myOrdersCount,
      ...statusCounts
    },
    review: { total: myReviewsCount },
    revenue: { total: totalRevenue }
  };
};
var customerStats = async (userId) => {
  const [
    ordersCount,
    reviewsCount,
    orderSummary,
    totalSpent,
    pendingOrders,
    unreviewedItemsCount
  ] = await Promise.all([
    prisma.order.count({ where: { customerId: userId } }),
    prisma.review.count({ where: { userId } }),
    prisma.order.groupBy({
      by: ["status"],
      where: { customerId: userId },
      _count: { id: true }
    }),
    prisma.order.aggregate({
      where: {
        customerId: userId,
        status: "DELIVERED"
      },
      _sum: { totalAmount: true }
    }),
    prisma.order.count({
      where: {
        customerId: userId,
        status: { in: ["PLACED", "PROCESSING", "SHIPPED"] }
      }
    }),
    prisma.orderItem.count({
      where: {
        order: {
          customerId: userId,
          status: "DELIVERED"
        },
        medicine: {
          reviews: {
            none: { userId }
          }
        }
      }
    })
  ]);
  const statusCounts = orderSummary.reduce((acc, curr) => {
    acc[curr.status.toLowerCase()] = curr._count.id;
    return acc;
  }, {});
  return {
    totalOrders: ordersCount,
    totalReviews: reviewsCount,
    totalSpent: totalSpent._sum.totalAmount || 0,
    activeOrders: pendingOrders,
    pendingReviews: unreviewedItemsCount,
    orderStats: statusCounts
  };
};
var updateProfile = async (userId, payload) => {
  const isUserExist = await prisma.user.findUnique({ where: { id: userId } });
  if (!isUserExist) throw new AppError("User not found!", 404);
  return await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true
    }
  });
};
var userService = {
  getMyProfile,
  getAllUsers,
  adminStats,
  sellerStats,
  customerStats,
  updateProfile
};

// src/modules/user/user.controller.ts
var getMyProfile2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await userService.getMyProfile(userId);
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllUsers2 = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "All users retrieved successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var adminStats2 = async (req, res, next) => {
  try {
    const result = await userService.adminStats();
    res.status(200).json({
      success: true,
      message: "Overall platform stats fetched successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var sellerStats2 = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    const result = await userService.sellerStats(sellerId);
    res.status(200).json({
      success: true,
      message: "Your sales and product stats fetched successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var customerStats2 = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const result = await userService.customerStats(customerId);
    res.status(200).json({
      success: true,
      message: "Your personal order summary fetched successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateProfile2 = async (req, res, next) => {
  try {
    const targetId = req.params.id || req.user.id;
    const userRole = req.user.role;
    if (userRole !== "ADMIN") {
      delete req.body.role;
      delete req.body.email;
      if (req.params.id && req.params.id !== req.user.id) {
        throw new AppError("Forbidden! You can only update your own profile.", 403);
      }
    }
    const result = await userService.updateProfile(targetId, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var userController = {
  getMyProfile: getMyProfile2,
  getAllUsers: getAllUsers2,
  adminStats: adminStats2,
  sellerStats: sellerStats2,
  customerStats: customerStats2,
  updateProfile: updateProfile2
};

// src/modules/user/user.route.ts
var router4 = express5.Router();
router4.get("/user/me", auth_default(Role.CUSTOMER, Role.ADMIN, Role.SELLER), userController.getMyProfile);
router4.get("/admin/users", auth_default(Role.ADMIN), userController.getAllUsers);
router4.get("/admin/stats", auth_default(Role.ADMIN), userController.adminStats);
router4.get("/seller/stats", auth_default(Role.SELLER), userController.sellerStats);
router4.get("/customer/stats", auth_default(Role.CUSTOMER), userController.customerStats);
router4.patch("/user/update/:id", auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN), userController.updateProfile);
router4.patch("/admin/users/:id", auth_default(Role.ADMIN), userController.updateProfile);
var userRoutes = router4;

// src/app.ts
var app = express6();
var allowedOrigins = [
  "http://localhost:3000",
  "https://medistore-iota.vercel.app",
  process.env.APP_URL,
  process.env.PROD_APP_URL
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/medistore-.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked for origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express6.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.json({ message: "MediStore Backend is running!" });
});
app.use("/api/categories", categoryRoute);
app.use("/api/medicines", medicineRoute);
app.use("/api/seller/medicines", medicineRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/seller/orders", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api", userRoutes);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
