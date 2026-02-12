import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Answer from "@/models/Answer";
import Survey from "@/models/Survey";
import * as XLSX from "xlsx-js-style";
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

    const survey = await Survey.findById(surveyId).lean();
    if (!survey) {
      return NextResponse.json({ error: "نظرسنجی یافت نشد" }, { status: 404 });
    }

    const responses = await Answer.find({ surveyId }).lean();

    const data = responses.map((response: any) => {
      const row: any = {
        "نام و نام خانوادگی": response?.userFullName || "-",
        "کد ملی": response?.userNationalCode || "-",
        "محل خدمت": response?.userServiceLocation || "-",
        "تاریخ پاسخ": new Date(response.createdAt).toLocaleDateString("fa-IR"),
      };

      survey.questions.forEach((question: any) => {
        const answerObj = response.answers.find(
          (a: any) => a.questionId?.toString() === question._id.toString()
        );

        let answerValue = "-";

        if (answerObj) {
          const value = answerObj.answer;

          if (typeof value === "string") {
            answerValue = value;
          } else if (Array.isArray(value)) {
            answerValue = value.join("، ");
          } else if (typeof value === "object" && value !== null) {
            const selectedPart = Array.isArray(value.selected)
              ? value.selected.join("، ")
              : "";

            const textPart = value.text
              ? ` | ${question?.descriptiveQuestion}: ${value.text}`
              : "";

            answerValue = `${selectedPart}${textPart}` || "-";
          }
        }

        row[question.question] = answerValue;
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    // راست‌چین کامل شیت
    worksheet["!sheetViews"] = [
      {
        rightToLeft: true,
      },
    ];

    const range = XLSX.utils.decode_range(worksheet["!ref"]!);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        worksheet[cellAddress].s = {
          font: {
            name: "Arial",
            sz: 11,
            bold: R === 0,
          },
          alignment: {
            horizontal: "right", // ← اینجا راست‌چین شد
            vertical: "center",
            wrapText: true,
          },
          fill:
            R === 0
              ? {
                  patternType: "solid",
                  fgColor: { rgb: "E7F3FF" },
                }
              : undefined,
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    }

    // تنظیم عرض ستون‌ها بر اساس بیشترین طول محتوا
    const colWidths = Object.keys(data[0] || {}).map((key) => {
      const maxLength = Math.max(
        key.length,
        ...data.map((row: any) => (row[key] ? row[key].toString().length : 0))
      );

      return { wch: maxLength + 4 };
    });

    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "پاسخ‌ها");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="responses.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
