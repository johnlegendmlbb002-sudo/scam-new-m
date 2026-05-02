import PricingConfig from "@/models/PricingConfig";
import { verifyAdmin } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

/* =================================================
   GET → Fetch pricing (SEPARATE FOR ALL ROLES)
   ================================================= */
export async function GET(req) {
  try {
    await verifyAdmin(req);

    const { searchParams } = new URL(req.url);
    const userType = searchParams.get("userType");

    if (!userType) {
      return NextResponse.json(
        { success: false, message: "userType is required" },
        { status: 400 }
      );
    }

    if (!["user", "member", "admin"].includes(userType)) {
      return NextResponse.json(
        { success: false, message: "Invalid userType" },
        { status: 400 }
      );
    }

    const pricing = await PricingConfig.findOne({
      userType,
    }).lean();

    return NextResponse.json({
      success: true,
      data: {
        slabs: pricing?.slabs || [],
        overrides: pricing?.overrides || [],
        gameOverrides: pricing?.gameOverrides || [],
      },
    });
  } catch (err) {
    console.error("GET pricing error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}

/* =================================================
   PATCH → Save pricing
   OWNER sets pricing for user / member / admin
   ================================================= */
export async function PATCH(req) {
  try {
    await verifyAdmin(req);

    const body = await req.json();
    let { userType, slabs = [], overrides = [], gameOverrides = [] } = body;

    if (!userType) {
      return NextResponse.json(
        { success: false, message: "userType is required" },
        { status: 400 }
      );
    }

    userType = userType.trim().toLowerCase();

    const validRoles = ["user", "member", "admin", "owner"];
    if (!validRoles.includes(userType)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid role: ${userType}. Supported roles are ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    /* ================= VALIDATE SLABS ================= */
    for (const s of slabs) {
      if (
        typeof s.min !== "number" ||
        typeof s.max !== "number" ||
        typeof s.percent !== "number"
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid slab format: min, max, and percent must be numbers" },
          { status: 400 }
        );
      }
    }

    /* ================= VALIDATE OVERRIDES ================= */
    for (const o of overrides) {
      if (
        !o.gameSlug ||
        !o.itemSlug ||
        typeof o.fixedPrice !== "number" ||
        o.fixedPrice < 0
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid override format: gameSlug, itemSlug, and valid fixedPrice are required" },
          { status: 400 }
        );
      }
    }

    /* ================= LOAD EXISTING ================= */
    let existing = await PricingConfig.findOne({ userType });

    if (!existing) {
      existing = new PricingConfig({ userType, slabs: [], overrides: [] });
    }

    /* ================= MERGE OVERRIDES ================= */
    const overrideMap = new Map();

    for (const o of existing.overrides || []) {
      if (o.gameSlug && o.itemSlug) {
        overrideMap.set(`${o.gameSlug}::${o.itemSlug}`, o);
      }
    }

    for (const o of overrides) {
      overrideMap.set(`${o.gameSlug}::${o.itemSlug}`, {
        gameSlug: o.gameSlug,
        itemSlug: o.itemSlug,
        fixedPrice: o.fixedPrice,
        useOverride: !!o.useOverride,
        inStock: o.inStock !== false, // default true
      });
    }

    const mergedOverrides = Array.from(overrideMap.values());

    /* ================= MERGE GAME OVERRIDES ================= */
    const gameOverrideMap = new Map();
    for (const go of existing.gameOverrides || []) {
      gameOverrideMap.set(go.gameSlug, go);
    }
    for (const go of gameOverrides) {
      gameOverrideMap.set(go.gameSlug, {
        gameSlug: go.gameSlug,
        inStock: go.inStock !== false,
      });
    }
    const mergedGameOverrides = Array.from(gameOverrideMap.values());

    /* ================= SAVE ================= */
    existing.slabs = slabs;
    existing.overrides = mergedOverrides;
    existing.gameOverrides = mergedGameOverrides;

    await existing.save();

    return NextResponse.json({
      success: true,
      message: `Pricing for ${userType} updated successfully`,
      data: existing,
    });
  } catch (err) {
    console.error("PATCH pricing error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}
