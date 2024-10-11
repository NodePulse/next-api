import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

const connectDatabase = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Database is already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }
  try {
    mongoose.connect(MONGODB_URL!, {
      dbName: "rest-apis",
      bufferCommands: true,
    });
    console.log("Database connected");
  } catch (error: any) {
    console.log("Error connecting to database", error);
    throw new Error("Error connecting to database", error);
  }
};

export default connectDatabase;

