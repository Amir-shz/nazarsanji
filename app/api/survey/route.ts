import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Survey from "@/models/Survey";

export async function GET() {
  try {
    await dbConnect();

    const surveys = await Survey.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return NextResponse.json(surveys);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
