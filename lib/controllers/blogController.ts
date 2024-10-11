import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connectDatabase from "../database";
import User from "../models/user";
import Category from "../models/category";
import Blog from "../models/blog";

export const getBlogs = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400, statusText: "Invalid user id" }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category id" },
        { status: 400, statusText: "Invalid category id" }
      );
    }

    await connectDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, statusText: "User not found" }
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404, statusText: "Category not found" }
      );
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    if (searchKeywords) {
      filter.$or = [
        {
          title: { $regex: searchKeywords, $options: "i" },
        },
        {
          description: { $regex: searchKeywords, $options: "i" },
        },
      ];
    }

    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    // const blogs = await Blog.find(filter).sort({ createdAt: "asc" });

    return NextResponse.json(
      { blogs },
      { status: 200, statusText: "Blog fetched successfully!" }
    );
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in getting blogs" }
    );
  }
};

export const createBlog = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const body = await req.json();
    const { title, description } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400, statusText: "Invalid user id" }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category id" },
        { status: 400, statusText: "Invalid category id" }
      );
    }

    await connectDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, statusText: "User not found" }
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404, statusText: "Category not found" }
      );
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();
    return NextResponse.json(
      { newBlog },
      { status: 200, statusText: "Blog created successfully!" }
    );
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in creating blog" }
    );
  }
};

export const getBlog = async (req: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400, statusText: "Invalid user id" }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category id" },
        { status: 400, statusText: "Invalid category id" }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { error: "Invalid blog id" },
        { status: 400, statusText: "Invalid blog id" }
      );
    }

    await connectDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, statusText: "User not found" }
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404, statusText: "Category not found" }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404, statusText: "Blog not found" }
      );
    }

    return NextResponse.json(
      { blog },
      { status: 200, statusText: "Blog fetched successfully!" }
    );
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in getting blog" }
    );
  }
};

export const updateBlog = async (req: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const body = await req.json();
    const { title, description } = body;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400, statusText: "Invalid user id" }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { error: "Invalid blog id" },
        { status: 400, statusText: "Invalid blog id" }
      );
    }

    await connectDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, statusText: "User not found" }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404, statusText: "Blog not found" }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );

    return NextResponse.json(
      { updatedBlog },
      { status: 200, statusText: "Blog updated successfully!" }
    );
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in updating a blog" }
    );
  }
};

export const deleteBlog = async (req: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400, statusText: "Invalid user id" }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { error: "Invalid blog id" },
        { status: 400, statusText: "Invalid blog id" }
      );
    }

    await connectDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, statusText: "User not found" }
      );
    }

    await Blog.findByIdAndDelete(blogId);

    return NextResponse.json(
      { message: "Blog deleted successfully!" },
      { status: 200, statusText: "Blog deleted successfully!" }
    );
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in deleting a blog" }
    );
  }
};
