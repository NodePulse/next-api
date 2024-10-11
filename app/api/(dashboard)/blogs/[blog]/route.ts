import {
  deleteBlog,
  getBlog,
  updateBlog,
} from "@/lib/controllers/blogController";

export const GET = getBlog;
export const PATCH = updateBlog;
export const DELETE = deleteBlog;
