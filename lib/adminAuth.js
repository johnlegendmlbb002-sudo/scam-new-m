import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "./mongodb";

export async function verifyAdmin(req) {
  await connectDB();
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    throw { status: 401, message: "Unauthorized" };
  }

  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId).select("userType");

  if (!user || user.userType !== "owner") {
    throw { status: 403, message: "Forbidden" };
  }

  return user;
}
