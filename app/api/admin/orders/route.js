import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/adminAuth";

/* =========================
   GET ALL ORDERS (OWNER)
   + Pagination + Search + Filters
========================= */
export async function GET(req) {
  try {
    await verifyAdmin(req);

    /* ================= QUERY PARAMS ================= */
    const { searchParams } = new URL(req.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
    const search = searchParams.get("search")?.trim();

    // 🔽 FILTERS
    const status = searchParams.get("status");
    const gameSlug = searchParams.get("gameSlug");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const skip = (page - 1) * limit;

    /* ================= FILTER ================= */
    let filter = {};

    // 🔍 Text search
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { gameSlug: { $regex: search, $options: "i" } },
        { itemName: { $regex: search, $options: "i" } },
        { playerId: { $regex: search, $options: "i" } },
      ];
    }

    // 📌 Status filter
    if (status) {
      filter.status = status;
    }

    // 🎮 Game filter
    if (gameSlug) {
      filter.gameSlug = gameSlug;
    }

    // 📅 Date range filter
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    /* ================= QUERY ================= */
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return Response.json({
      success: true,
      data: orders,
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

/* =========================
   UPDATE ORDER STATUS
   (UNCHANGED)
========================= */
export async function PATCH(req) {
  try {
    await verifyAdmin(req);

    const { orderId, status } = await req.json();

    if (!orderId || !status || typeof orderId !== "string" || typeof status !== "string") {
      return Response.json(
        { success: false, message: "orderId and status required as strings" },
        { status: 400 }
      );
    }

    const allowedStatus = ["pending", "success", "failed", "cancelled", "refund"];
    if (!allowedStatus.includes(status)) {
      return Response.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const update = {
      status,
      updatedAt: new Date(),
    };

    if (status === "success") {
      update.paymentStatus = "success";
      update.topupStatus = "success";
    }

    if (status === "failed") {
      update.topupStatus = "failed";
    }

    if (status === "refund") {
      update.topupStatus = "refund";
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      update,
      { new: true }
    );

    if (!order) {
      return Response.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Order status updated",
      data: order,
    });

  } catch (err) {
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}
