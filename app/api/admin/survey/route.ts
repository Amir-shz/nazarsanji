import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Survey from "@/models/Survey";
import { verifySession } from "@/lib/session";

// GET all surveys (admin)
export async function GET(request: NextRequest) {
  const auth = await verifySession();
  if (!auth.isAuth) return;

  try {
    await dbConnect();
    const surveys = await Survey.find().sort({ createdAt: -1 });
    return NextResponse.json(surveys);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}

// POST create new survey (admin)
export async function POST(request: NextRequest) {
  const auth = await verifySession();
  if (!auth.isAuth) return;

  try {
    await dbConnect();

    const body = await request.json();
    const { name, description, endDate, questions } = body;

    console.log(name);
    console.log(description);
    console.log(endDate);
    console.log(questions);

    // if (!name || !endDate) {
    //   return NextResponse.json(
    //     { error: "نام و تاریخ پایان الزامی‌اند" },
    //     { status: 400 }
    //   );
    // }

    const survey = await Survey.create({
      name,
      description: description || "",
      endDate,
      questions: questions || [],
      isActive: true,
    });

    return NextResponse.json(survey, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
