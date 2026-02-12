import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Answer from "@/models/Answer";
import Survey from "@/models/Survey";
import { verifySession } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surveyId: string }> }
) {
  const auth = await verifySession();
  if (!auth.isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { surveyId } = await params;

    // گرفتن خود نظرسنجی
    const survey = await Survey.findById(surveyId).lean();

    if (!survey) {
      return NextResponse.json({ error: "نظرسنجی پیدا نشد" }, { status: 404 });
    }

    // گرفتن پاسخ‌ها
    const responses = await Answer.find({ surveyId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      survey,
      responses,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
