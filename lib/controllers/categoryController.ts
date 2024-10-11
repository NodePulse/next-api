import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connectDatabase from "../database";
import User from "../models/user";
import Category from "../models/category";

export const getCategory = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    await connectDatabase();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400, statusText: "Invalid user id" }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, statusText: "User not found" }
      );
    }

    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return NextResponse.json(
      { categories },
      { status: 200, statusText: "success" }
    );
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in fetching categories" }
    );
  }
};

export const createCategory = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    await connectDatabase();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400, statusText: "Invalid user id" }
      );
    }

    const { title } = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, statusText: "User not found" }
      );
    }

    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    await newCategory.save();

    return NextResponse.json(
      { newCategory },
      { status: 200, statusText: "Category created successfully" }
    );
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in creating category" }
    );
  }
};

export const updateCategory = async (
  req: Request,
  context: { params: any }
) => {
  const categoryId = context.params.category;
  try {
    const body = await req.json();
    const { title } = body;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    await connectDatabase();

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

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, statusText: "User not found" }
      );
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404, statusText: "Category not found" }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return NextResponse.json(
      { updatedCategory },
      { status: 200, statusText: "Category updated successfully" }
    );
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in updating category" }
    );
  }
};

export const deleteCategory = async (
  req: Request,
  context: { params: any }
) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

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

    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404, statusText: "Category not found" }
      );
    }

    await Category.findByIdAndDelete(categoryId);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200, statusText: "Category deleted successfully" }
    );
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in deleting category" }
    );
  }
};
