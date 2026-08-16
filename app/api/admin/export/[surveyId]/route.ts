import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Answer from "@/models/Answer";
import Survey from "@/models/Survey";
import * as XLSX from "xlsx-js-style";
import { verifySession } from "@/lib/session";

function generateRandom5Digit(): number {
  return Math.floor(Math.random() * 90000) + 10000;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surveyId: string }> },
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

    //

    const headers: string[] = ["کد ملی", "تاریخ پاسخ"];

    // نگهداری نام ستون‌های یکتا برای هر سوال (براساس _id)
    const questionHeaderMap: Record<
      string,
      { main: string; optionMap: Record<string, string>; desc?: string }
    > = {};

    for (const question of survey.questions) {
      const qId = question._id.toString();

      // ستون اصلی برای متن سوال همراه با شناسهٔ سوال تا یکتا باشد
      const mainHeader = `${question.question} (${qId})`;
      headers.push(mainHeader);

      const optionMap: Record<string, string> = {};

      if (question.type === "multi" || question.type === "multi_with_text") {
        for (const option of question.options) {
          // هر ستون گزینه نیز شامل شناسهٔ سوال می‌شود تا بین سوال‌ها تداخل ایجاد نشود
          const optHeader = `${option} (${qId})`;
          headers.push(optHeader);
          optionMap[option] = optHeader;
        }
      }

      if (
        question.type === "multi_with_text" ||
        question.type === "single_with_text"
      ) {
        const descHeader = `${question.descriptiveQuestion} (${qId})`;
        headers.push(descHeader);
        questionHeaderMap[qId] = {
          main: mainHeader,
          optionMap,
          desc: descHeader,
        };
      } else {
        questionHeaderMap[qId] = { main: mainHeader, optionMap };
      }
    }

    const data = responses.map((response: any) => {
      const row: any = {};

      // مقدار اولیه همه ستون‌ها خالی باشه
      headers.forEach((h) => (row[h] = ""));

      row["کد ملی"] = response?.userNationalCode || "-";
      row["تاریخ پاسخ"] = new Date(response.createdAt).toLocaleDateString(
        "fa-IR",
      );

      for (const question of survey.questions) {
        const qId = question._id.toString();
        const headerInfo = questionHeaderMap[qId];

        const answerObj = response.answers.find(
          (a: any) => a.questionId?.toString() === qId,
        );

        if (!answerObj) continue;

        const value = answerObj.answer;

        // ستونِ کلیِ سوال (متن خلاصهٔ پاسخ)
        const mainHeader = headerInfo.main;
        row[mainHeader] =
          typeof value === "string"
            ? value
            : Array.isArray(value)
              ? value.join("، ")
              : value?.selected?.join("، ") || "";

        // ستون‌های مربوط به هر گزینه (با نام یکتا شامل شناسه سوال)
        if (question.options) {
          for (const option of question.options) {
            const colName =
              headerInfo.optionMap[option] || `${option} (${qId})`;

            if (Array.isArray(value)) {
              row[colName] = value.includes(option) ? 1 : 0;
            } else if (value?.selected) {
              row[colName] = value.selected.includes(option) ? 1 : 0;
            }
          }
        }

        // ستون توضیحی در صورت وجود
        if (value?.text && headerInfo.desc) {
          row[headerInfo.desc] = value.text;
        }
      }

      return row;
    });

    //

    // const data = responses.map((response: any) => {
    //   const row: any = {
    //     "کد ملی": response?.userNationalCode || "-",
    //     "تاریخ پاسخ": new Date(response.createdAt).toLocaleDateString("fa-IR"),
    //   };

    //   for (const question of survey.questions) {
    //     const answerObj = response.answers.find(
    //       (a: any) => a.questionId?.toString() === question._id.toString(),
    //     );

    //     if (answerObj) {
    //       const value = answerObj.answer;

    //       if (question.type === "text") {
    //         row[question.question] = value;
    //       }
    //       if (question.type === "single") {
    //         row[question.question] = value;

    //         // question.options.map((option) => {
    //         //   if (value === option) {
    //         //     row[`${option} (${generateRandom5Digit()})`] = 1;
    //         //   } else {
    //         //     row[`${option} (${generateRandom5Digit()})`] = 0;
    //         //   }
    //         // });
    //       }
    //       if (question.type === "multi") {
    //         row[question.question] = value.join("، ");

    //         question.options.map((option: any) => {
    //           if (value.includes(option)) {
    //             row[`${option} (${generateRandom5Digit()})`] = 1;
    //           } else {
    //             row[`${option} (${generateRandom5Digit()})`] = 0;
    //           }
    //         });
    //       }
    //       if (question.type === "multi_with_text") {
    //         row[question.question] = value.selected.join("، ");

    //         question.options.map((option: any) => {
    //           if (value.selected.includes(option)) {
    //             row[`${option} (${generateRandom5Digit()})`] = 1;
    //           } else {
    //             row[`${option} (${generateRandom5Digit()})`] = 0;
    //           }
    //         });

    //         const textPart = value.text ? value.text : "";
    //         row[`${question.descriptiveQuestion} (${generateRandom5Digit()})`] =
    //           textPart;
    //       }
    //       if (question.type === "single_with_text") {
    //         row[question.question] = value.selected.at(0);

    //         // question.options.map((option) => {
    //         //   if (value.selected.includes(option)) {
    //         //     row[`${option} (${generateRandom5Digit()})`] = 1;
    //         //   } else {
    //         //     row[`${option} (${generateRandom5Digit()})`] = 0;
    //         //   }
    //         // });

    //         const textPart = value.text ? value.text : "";
    //         row[`${question.descriptiveQuestion} (${generateRandom5Digit()})`] =
    //           textPart;
    //       }
    //     }
    //   }

    //   return row;
    // });

    // const worksheet = XLSX.utils.json_to_sheet(data);

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers,
    });

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
        ...data.map((row: any) => (row[key] ? row[key].toString().length : 0)),
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
      { status: 500 },
    );
  }
}
