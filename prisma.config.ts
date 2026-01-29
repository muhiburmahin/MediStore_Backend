import "dotenv/config";
import { defineConfig } from "prisma/config";
import process from 'process';

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL, // এটি এখন মাইগ্রেশন হ্যান্ডেল করবে
  },
});