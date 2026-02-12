import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Survey from "@/models/Survey";
import { verifySession } from "@/lib/session";

// GET single survey
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifySession();
  if (!auth.isAuth) return;

  try {
    await dbConnect();
    const { id } = await params;
    const survey = await Survey.findById(id);

    if (!survey) {
      return NextResponse.json({ error: "نظرسنجی یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}

// PUT update survey
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifySession();
  if (!auth.isAuth) return;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const survey = await Survey.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!survey) {
      return NextResponse.json({ error: "نظرسنجی یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}

// DELETE survey
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifySession();
  if (!auth.isAuth) return;

  try {
    await dbConnect();
    const { id } = await params;

    const survey = await Survey.findByIdAndDelete(id);

    if (!survey) {
      return NextResponse.json({ error: "نظرسنجی یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "نظرسنجی حذف شد" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
