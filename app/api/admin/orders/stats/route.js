import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req) {
    try {
        await verifyAdmin(req);

        const now = new Date();

        const getStatsForPeriod = async (days) => {
            const gteDate = new Date();
            gteDate.setDate(now.getDate() - days);

            const stats = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: gteDate },
                        status: { $in: ["success", "SUCCESS"] },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalValue: { $sum: "$price" },
                    },
                },
            ]);

            const count = await Order.countDocuments({
                createdAt: { $gte: gteDate }
            });

            return {
                count,
                totalValue: stats.length > 0 ? stats[0].totalValue : 0
            };
        };

        const [stats1d, stats7d, stats30d] = await Promise.all([
            getStatsForPeriod(1),
            getStatsForPeriod(7),
            getStatsForPeriod(30),
        ]);

        return Response.json({
            success: true,
            data: {
                "1d": stats1d,
                "7d": stats7d,
                "30d": stats30d,
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
