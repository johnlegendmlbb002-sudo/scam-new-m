import WalletTransaction from "@/models/WalletTransaction";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req) {
    try {
        await verifyAdmin(req);

        /* ================= QUERY PARAMS ================= */
        const { searchParams } = new URL(req.url);

        const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
        const search = searchParams.get("search")?.trim();
        const userId = searchParams.get("userId")?.trim();

        const skip = (page - 1) * limit;

        /* ================= FILTER ================= */
        let filter = {};

        if (userId) {
            filter.userId = userId;
        }

        if (search) {
            filter.$or = [
                { transactionId: { $regex: search, $options: "i" } },
                { userId: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
            ];
        }

        /* ================= QUERY ================= */
        const [transactions, total] = await Promise.all([
            WalletTransaction.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            WalletTransaction.countDocuments(filter),
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
        console.error("Wallet Transactions API Error:", err);
        return Response.json(
            { success: false, message: err.message || "Server error" },
            { status: err.status || 500 }
        );
    }
}
