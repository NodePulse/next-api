import {
  deleteCategory,
  updateCategory,
} from "@/lib/controllers/categoryController";

export const PATCH = updateCategory;
export const DELETE = deleteCategory;
