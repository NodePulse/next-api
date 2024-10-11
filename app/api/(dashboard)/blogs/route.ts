import { createBlog, getBlogs } from "@/lib/controllers/blogController";

export const GET = getBlogs;
export const POST = createBlog;
