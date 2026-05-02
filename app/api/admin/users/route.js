import User from "@/models/User";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req) {
  try {
    await verifyAdmin(req);

    /* ================= QUERY PARAMS ================= */
    const { searchParams } = new URL(req.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
    const search = searchParams.get("search")?.trim();
    const userType = searchParams.get("userType")?.trim();

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const skip = (page - 1) * limit;

    /* ================= FILTER ================= */
    let filter = {};

    // 🔍 Text search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // 👤 Filter by role
    if (userType) {
      filter.userType = userType;
    }

    // 📅 Filter by createdAt date range
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;

    /* ================= QUERY ================= */
    const [users, total, stats] = await Promise.all([
      User.find(filter, "-password")
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
      User.aggregate([
        { $group: { _id: null, totalWallet: { $sum: "$wallet" } } }
      ])
    ]);

    /* ================= RESPONSE ================= */
    return Response.json({
      success: true,
      data: users,
      totalWalletCredit: stats[0]?.totalWallet || 0,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}
