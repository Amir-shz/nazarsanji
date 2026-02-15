"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Question {
  _id: string;
  question: string;
  descriptiveQuestion: string;
}

interface Survey {
  _id: string;
  questions: Question[];
}

interface Answer {
  questionId: string;
  answer: any;
}

interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  serviceLocation: string;
}

interface Response {
  _id: string;
  userFullName: string;
  userNationalCode: string;
  userServiceLocation: string;
  answers: Answer[];
  createdAt: string;
}

export default function ResponsesPage({
  params,
}: {
  params: Promise<{ surveyId: string }>;
}) {
  const [surveyId, setSurveyId] = useState<string>("");
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(
    null,
  );

  useEffect(() => {
    const resolveParams = async () => {
      const { surveyId: id } = await params;
      setSurveyId(id);
      fetchResponses(id);
    };
    resolveParams();
  }, [params]);

  const fetchResponses = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/responses/${id}`);
      if (!response.ok) throw new Error("Failed to fetch responses");

      const data = await response.json();

      setSurvey(data.survey);
      setResponses(data.responses);
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>درحال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin">
          <Button variant="outline" className="mb-6">
            بازگشت
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          پاسخ‌های نظرسنجی
        </h1>

        {responses.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
            هیچ پاسخی دریافت نشده است
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-right font-semibold">
                      کد ملی
                    </th>
                    <th className="px-6 py-3 text-right font-semibold">
                      تاریخ
                    </th>
                    <th className="px-6 py-3 text-right font-semibold">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => (
                    <tr
                      key={response._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        {response?.userNationalCode}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(response.createdAt).toLocaleDateString(
                          "fa-IR",
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedResponse(response)}
                            >
                              مشاهده
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[80vh] overflow-y-auto max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>جزئیات پاسخ</DialogTitle>
                            </DialogHeader>

                            {selectedResponse && (
                              <div className="space-y-4">
                                <div className="border-t pt-4">
                                  <h3 className="font-semibold mb-4">
                                    پاسخ‌ها
                                  </h3>

                                  <div className="space-y-3">
                                    {selectedResponse.answers.map(
                                      (answer, idx) => {
                                        const questionData =
                                          survey?.questions?.find(
                                            (q) =>
                                              q._id.toString() ===
                                              answer.questionId,
                                          );

                                        const value = answer.answer;

                                        return (
                                          <div
                                            key={idx}
                                            className="bg-gray-50 p-3 rounded space-y-2"
                                          >
                                            {/* متن سوال */}
                                            <p className="text-sm text-gray-600">
                                              {questionData?.question ||
                                                `سؤال ${idx + 1}`}
                                            </p>

                                            {/* string */}
                                            {typeof value === "string" && (
                                              <p className="font-semibold">
                                                {value}
                                              </p>
                                            )}

                                            {/* array */}
                                            {Array.isArray(value) && (
                                              <p className="font-semibold">
                                                {value.join("، ")}
                                              </p>
                                            )}

                                            {/* object (multi_with_text) */}
                                            {typeof value === "object" &&
                                              value !== null &&
                                              !Array.isArray(value) && (
                                                <div className="space-y-2">
                                                  {Array.isArray(
                                                    value.selected,
                                                  ) &&
                                                    value.selected.length >
                                                      0 && (
                                                      <p className="font-semibold">
                                                        {value.selected.join(
                                                          "، ",
                                                        )}
                                                      </p>
                                                    )}

                                                  {value.text && (
                                                    <div className="bg-white p-2 rounded border text-sm">
                                                      {
                                                        questionData?.descriptiveQuestion
                                                      }
                                                      : {value.text}
                                                    </div>
                                                  )}
                                                </div>
                                              )}

                                            {!value && (
                                              <p className="font-semibold">-</p>
                                            )}
                                          </div>
                                        );
                                      },
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Export Button */}
        {responses.length > 0 && (
          <div className="mt-6">
            <a href={`/api/admin/export/${surveyId}`} download>
              <Button className="bg-green-600 hover:bg-green-700">
                دانلود پاسخ‌ها (Excel)
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
