import { connectDB } from "@/lib/mongodb";
import SupportQuery from "@/models/SupportQuery";
import User from "@/models/User";
import jwt from "jsonwebtoken";

/* ================= AUTH (ADMIN ONLY) ================= */
async function verifyAdmin(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    throw { status: 401, message: "Unauthorized" };
  }

  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId).select("userType");

  if (!user || (user.userType !== "admin" && user.userType !== "owner")) {
    throw { status: 403, message: "Forbidden" };
  }

  return decoded;
}

/* ================= GET ALL QUERIES ================= */
export async function GET(req) {
  try {
    await connectDB();
    await verifyAdmin(req);

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search");

    const query = {};

    // -------- SEARCH (optional) --------
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
      ];
    }

    const total = await SupportQuery.countDocuments(query);

    const data = await SupportQuery.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return Response.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}
