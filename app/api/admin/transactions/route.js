import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req) {
  try {
    await verifyAdmin(req);

    /* ================= QUERY PARAMS ================= */
    const { searchParams } = new URL(req.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
    const search = searchParams.get("search")?.trim();

    const skip = (page - 1) * limit;

    /* ================= BASE FILTER ================= */
    let filter = {
      paymentStatus: { $in: ["success", "completed", "paid"] },
    };

    /* ================= SEARCH FILTER ================= */
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { gameSlug: { $regex: search, $options: "i" } },
        { itemName: { $regex: search, $options: "i" } },
        { playerId: { $regex: search, $options: "i" } },
        { paymentMethod: { $regex: search, $options: "i" } },
      ];
    }

    /* ================= QUERY ================= */
    const [transactions, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return Response.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Transaction API Error:", err);
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}
