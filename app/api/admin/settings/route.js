import SystemSetting from "@/models/SystemSetting";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req) {
    try {
        await verifyAdmin(req);

        const settings = await SystemSetting.find().lean();

        // Convert array to object for easier consumption
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return Response.json({
            success: true,
            data: settingsObj,
        });
    } catch (err) {
        console.error(err);
        return Response.json(
          { success: false, message: err.message || "Server error" },
          { status: err.status || 500 }
        );
    }
}

export async function PATCH(req) {
    try {
        await verifyAdmin(req);

        const { settings } = await req.json();

        if (!settings || typeof settings !== "object") {
            return Response.json({ message: "Invalid settings data" }, { status: 400 });
        }

        const updatePromises = Object.entries(settings).map(([key, value]) => {
            return SystemSetting.findOneAndUpdate(
                { key },
                { value },
                { upsert: true, new: true }
            );
        });

        await Promise.all(updatePromises);

        return Response.json({
            success: true,
            message: "Settings updated successfully",
        });
    } catch (err) {
        console.error(err);
        return Response.json(
          { success: false, message: err.message || "Server error" },
          { status: err.status || 500 }
        );
    }
}
