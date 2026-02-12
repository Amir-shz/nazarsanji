"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { QUESTION_TYPES } from "@/lib/config";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { DayPicker } from "react-day-picker/persian";
import "react-day-picker/style.css";
import { toPersianDate } from "@/lib/utils";

interface Question {
  _id?: string;
  question: string;
  type: "text" | "single" | "multi" | "multi_with_text";
  options: string[];
  descriptiveQuestion?: string; // سوال تشریحی اضافه
}

export default function SurveyBuilder({
  surveyId,
  isEdit = false,
}: {
  surveyId?: string;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endDate: new Date(),
  });
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      type: "text",
      options: [],
      descriptiveQuestion: "",
    },
  ]);

  useEffect(() => {
    if (isEdit && surveyId) {
      fetchSurvey();
    }
  }, [isEdit, surveyId]);

  const fetchSurvey = async () => {
    try {
      const response = await fetch(`/api/admin/survey/${surveyId}`);
      if (!response.ok) throw new Error("Failed to fetch survey");
      const survey = await response.json();
      setFormData({
        name: survey.name,
        description: survey.description,
        endDate: survey.endDate,
      });
      setSelectedDay(survey.endDate);
      setQuestions(survey.questions || []);
    } catch (error) {
      setError("خطا در بارگذاری نظرسنجی");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];

    // اگر نوع سوال تغییر کرد
    if (field === "type") {
      // اگر به multi_with_text تغییر کرد، مقدار پیش‌فرض برای descriptiveQuestion تنظیم کن
      if (value === "multi_with_text") {
        newQuestions[index].descriptiveQuestion =
          newQuestions[index].descriptiveQuestion || "";
      }
      // اگر از multi_with_text به نوع دیگه تغییر کرد، descriptiveQuestion رو پاک کن
      if (
        newQuestions[index].type === "multi_with_text" &&
        value !== "multi_with_text"
      ) {
        delete newQuestions[index].descriptiveQuestion;
      }
    }

    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "text",
        options: [],
        descriptiveQuestion: "",
        // required: true,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name) {
      setError("نام نظرسنجی الزامی است");
      return;
    }

    // اعتبارسنجی سوالات
    for (const q of questions) {
      if (!q.question) {
        setError("تمام سؤالات باید متن داشته باشند");
        return;
      }

      // اعتبارسنجی گزینه‌ها برای انواع خاص
      if (
        q.type === "single" ||
        q.type === "multi" ||
        q.type === "multi_with_text"
      ) {
        if (q.options.length === 0 || q.options.some((opt) => !opt.trim())) {
          setError("تمام گزینه‌ها باید مقدار داشته باشند");
          return;
        }
      }

      // اعتبارسنجی سوال تشریحی برای multi_with_text
      if (q.type === "multi_with_text" && !q.descriptiveQuestion) {
        setError("متن سوال تشریحی برای نوع multi_with_text الزامی است");
        return;
      }
    }

    setSubmitting(true);
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `/api/admin/survey/${surveyId}`
        : "/api/admin/survey";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          questions,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "خطا در ثبت نظرسنجی");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "خطا در ثبت نظرسنجی");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">درحال بارگذاری...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold">اطلاعات نظرسنجی</h2>

        <div>
          <label className="block text-sm font-medium mb-1">نام نظرسنجی</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="نام نظرسنجی را وارد کنید"
            required
            className="text-right"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">توضیح</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="توضیح اختیاری"
            className="text-right min-h-24"
            rows={6}
          />
        </div>

        <div className="[&>div]:w-full [&>div]:min-h-9">
          <label className="block text-sm font-medium mb-1">تاریخ پایان</label>
          <DayPicker
            animate
            mode="single"
            // locale={faIR}
            selected={selectedDay}
            onSelect={(val) => {
              setSelectedDay(val);
              setFormData((prev) => ({
                ...prev,
                endDate: new Date(val),
              }));
            }}
            footer={
              selectedDay
                ? `انتخاب شده: ${toPersianDate(new Date(selectedDay))}`
                : "انتخاب کنید"
            }
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">سؤالات</h2>

        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="bg-white p-6 rounded-lg shadow-md space-y-4 border-r-4 border-blue-500"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">سؤال {digitsEnToFa(qIndex + 1)}</h3>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                >
                  حذف
                </Button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">متن سؤال</label>
              <Input
                type="text"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                placeholder="متن سؤال را وارد کنید"
                className="text-right"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">نوع</label>
                <Select
                  dir="rtl"
                  value={question.type}
                  onValueChange={(val) =>
                    handleQuestionChange(qIndex, "type", val)
                  }
                >
                  <SelectTrigger className="w-full min-w-80">
                    <SelectValue placeholder="یک مورد انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {QUESTION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options */}
            {(question.type === "single" ||
              question.type === "multi" ||
              question.type === "multi_with_text") && (
              <div className="space-y-3">
                <label className="block text-sm font-medium">گزینه‌ها</label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-2">
                    <Input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                      placeholder={`گزینه ${oIndex + 1}`}
                      className="flex-1 text-right"
                    />
                    {question.options.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(qIndex, oIndex)}
                      >
                        حذف
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(qIndex)}
                  className="w-full"
                >
                  افزودن گزینه
                </Button>
              </div>
            )}

            {/* Descriptive Question for multi_with_text */}
            {question.type === "multi_with_text" && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    سوال تشریحی
                  </span>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    متن سوال تشریحی
                  </label>
                  <Textarea
                    value={question.descriptiveQuestion || ""}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "descriptiveQuestion",
                        e.target.value
                      )
                    }
                    placeholder="متن سوال تشریحی را وارد کنید..."
                    className="text-right min-h-20"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    این سوال بعد از گزینه‌ها نمایش داده می‌شود و کاربر می‌تواند
                    پاسخ تشریحی وارد کند
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="w-full"
        >
          افزودن سؤال جدید
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {submitting ? "درحال ثبت..." : isEdit ? "ویرایش" : "ایجاد"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          لغو
        </Button>
      </div>
    </form>
  );
}
