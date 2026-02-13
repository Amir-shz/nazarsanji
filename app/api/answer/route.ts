import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Answer from "@/models/Answer";
import Survey from "@/models/Survey";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      surveyId,
      answers,
      userNationalCode,
      userFullName,
      userServiceLocation,
    } = body;

    if (
      !surveyId ||
      !answers ||
      !userNationalCode ||
      !userFullName ||
      !userServiceLocation
    ) {
      return NextResponse.json(
        { error: "داده‌های الزامی وجود ندارند" },
        { status: 400 }
      );
    }

    // Check if survey exists and is not expired
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return NextResponse.json({ error: "نظرسنجی یافت نشد" }, { status: 404 });
    }

    // کپی می‌گیریم که اصل دیت خراب نشه
    const endOfDay = new Date(survey.endDate);

    // می‌بریمش به آخر اون روز (23:59:59.999)
    endOfDay.setHours(23, 59, 59, 999);

    const now = new Date();
    if (now > endOfDay) {
      return NextResponse.json(
        { error: "مهلت پاسخ دهی به نظرسنجی پایان یافته است" },
        { status: 400 }
      );
    }

    // Check if user already answered this survey
    const existingAnswer = await Answer.findOne({
      surveyId,
      userNationalCode,
    });

    if (existingAnswer) {
      return NextResponse.json(
        { error: "شما قبلاً به این نظرسنجی پاسخ داده‌اید" },
        { status: 409 }
      );
    }

    // Create answer
    const formattedAnswers = answers.map((answer: any, index: number) => ({
      questionId: survey.questions[index]?._id,
      answer,
    }));

    const newAnswer = await Answer.create({
      surveyId,
      userNationalCode,
      userFullName,
      userServiceLocation,
      answers: formattedAnswers,
    });

    return NextResponse.json(
      { success: true, answerId: newAnswer._id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
