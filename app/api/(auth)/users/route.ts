import {
  deleteUsers,
  getAllUsers,
  registerUser,
  updateUsername,
} from "@/lib/controllers/userController";

export const GET = getAllUsers;
export const POST = registerUser;
export const PATCH = updateUsername;
export const DELETE = deleteUsers;
