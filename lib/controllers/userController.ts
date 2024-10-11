import { NextResponse } from "next/server";
import connectDatabase from "../database";
import User from "../models/user";
import { Types } from "mongoose";

const objectId = require("mongoose").Types.ObjectId;

export const getAllUsers = async () => {
  try {
    await connectDatabase();
    const users = await User.find().select("-password");
    return NextResponse.json(
      { users },
      { status: 200, statusText: "Users Fetched Successfully" }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in fetching users" }
    );
  }
};

export const registerUser = async (req: Request) => {
  try {
    const body = await req.json();
    await connectDatabase();
    const newUser = await User.create(body);
    newUser.save();
    return NextResponse.json(
      { newUser },
      { status: 200, statusText: "User created successfully" }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in creating user" }
    );
  }
};

export const updateUsername = async (req: Request) => {
  try {
    const body = await req.json();
    const { userId, value } = body;
    await connectDatabase();
    if (!userId || !value) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400, statusText: "Invalid request" }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400, statusText: "Invalid user id" }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new objectId(userId) },
      { username: value },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, statusText: "User not found" }
      );
    }

    return NextResponse.json(
      { updatedUser },
      { status: 200, statusText: "User updated successfully" }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in updating user" }
    );
  }
};

export const deleteUsers = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    await connectDatabase();
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400, statusText: "Invalid request" }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400, statusText: "Invalid user id" }
      );
    }

    const deletedUser = await User.findOneAndDelete({
      _id: new objectId(userId),
    });

    if (!deletedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, statusText: "User not found" }
      );
    }

    return NextResponse.json(
      { deletedUser },
      { status: 200, statusText: "User deleted successfully" }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Error in deleting user" }
    );
  }
};
