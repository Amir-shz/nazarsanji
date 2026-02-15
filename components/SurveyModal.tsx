"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useRouter } from "next/navigation";
import { hasAnswer } from "@/lib/actions";

type QuestionType =
  | "single"
  | "multi"
  | "multi_with_text"
  | "text"
  | "single_with_text";

interface IQuestion {
  question: string;
  type: QuestionType;
  options?: string[];
  descriptiveQuestion?: string;
}

export default function SurveyModal({ survey }: { survey: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(
    JSON.parse(String(localStorage.getItem("userInfo"))),
  );
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>(
    Array(survey.questions.length).fill(null),
  );

  const handleAnswerChange = (value: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    const currentAns = answers[currentQuestion];

    // بررسی نکردن جواب
    if (currentQ.type === "text" && !currentAns) {
      alert("لطفاً جواب خود را وارد کنید");
      return;
    }

    if (currentQ.type === "single" && !currentAns) {
      alert("لطفاً یک گزینه انتخاب کنید");
      return;
    }

    if (currentQ.type === "multi" && (!currentAns || currentAns.length === 0)) {
      alert("لطفاً حداقل یک گزینه انتخاب کنید");
      return;
    }

    if (
      currentQ.type === "multi_with_text" &&
      (!currentAns || !currentAns.selected || currentAns.selected.length === 0)
    ) {
      alert("لطفاً حداقل یک گزینه انتخاب کنید");
      return;
    }

    // رفتن به سوال بعدی یا ثبت نهایی
    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // console.log("پاسخ‌های نهایی:", answers);
      // ثبت پاسخ ها

      await submit();
      setOpen(false);
      resetSurvey();
    }
  };

  const handlePrev = () => {
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleCancel = () => {
    setOpen(false);
    resetSurvey();
  };

  const resetSurvey = () => {
    setCurrentQuestion(0);
    setAnswers(Array(survey.questions.length).fill(null));
  };

  const submit = async () => {
    setLoading(true);

    if (!userInfo) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: survey?._id,
          userNationalCode: userInfo?.nationalCode,
          answers,
        }),
      });

      if (response.ok) {
        alert("پاسخ‌ها ثبت شد");
        setOpen(false);
        setAnswers(new Array(survey.questions.length).fill(null));
      } else {
        const error = await response.json();
        alert(error.error || "خطا در ثبت پاسخ‌ها");
      }
    } catch (error) {
      alert("خطا در ثبت پاسخ‌ها");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const currentQ: IQuestion = survey.questions[currentQuestion];

  async function handleOpenModal() {
    console.log("open");
    const has = await hasAnswer(survey?._id, userInfo?.nationalCode);

    if (!has) {
      setOpen(false);
      alert("شما قبلاً به این نظرسنجی پاسخ داده‌اید");
      return;
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleOpenModal}
        >
          شرکت در نظرسنجی
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-lg rounded-xl p-6 bg-white shadow-xl text-right [&>button]:hidden max-h-[90dvh] overflow-y-scroll"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* حذف ضربدر */}
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-blue-700 text-right">
            نظرسنجی
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 text-right flex flex-col gap-3 -mt-1">
            <p>{survey.description}</p>
            <p>
              سوال {digitsEnToFa(currentQuestion + 1)} از{" "}
              {digitsEnToFa(survey.questions.length)}
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col gap-4 text-right">
          <p className="text-base font-medium">{currentQ.question}</p>

          {/* text */}
          {currentQ.type === "text" && (
            <Input
              placeholder="جواب خود را وارد کنید"
              value={answers[currentQuestion] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 rounded-md"
            />
          )}

          {/* single */}
          {currentQ.type === "single" && currentQ.options && (
            <RadioGroup
              value={answers[currentQuestion] || ""}
              onValueChange={handleAnswerChange}
              className="flex flex-col gap-2"
              dir="rtl"
            >
              {currentQ.options.map((opt) => (
                <div
                  key={opt}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleAnswerChange(opt)} // کلیک روی کل ردیف
                >
                  <RadioGroupItem
                    value={opt}
                    id={opt}
                    className="accent-blue-600 pointer-events-none"
                  />
                  <label htmlFor={opt} className="cursor-pointer">
                    {opt}
                  </label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* multi */}
          {currentQ.type === "multi" && currentQ.options && (
            <div className="flex flex-col gap-2">
              {currentQ.options.map((opt) => (
                <div
                  key={opt}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 cursor-pointer"
                  onClick={() => {
                    const currentAns = answers[currentQuestion] || [];
                    if (currentAns.includes(opt)) {
                      handleAnswerChange(
                        currentAns.filter((a: string) => a !== opt),
                      );
                    } else {
                      handleAnswerChange([...currentAns, opt]);
                    }
                  }}
                >
                  <Checkbox
                    checked={answers[currentQuestion]?.includes(opt) || false}
                    onCheckedChange={() => {}}
                    className="accent-blue-600 pointer-events-none"
                  />
                  <label className="cursor-pointer">{opt}</label>
                </div>
              ))}
            </div>
          )}

          {/* multi_with_text */}
          {currentQ.type === "multi_with_text" && currentQ.options && (
            <>
              <div className="flex flex-col gap-2">
                {currentQ.options.map((opt) => (
                  <div
                    key={opt}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 cursor-pointer"
                    onClick={() => {
                      const currentAns = answers[currentQuestion] || {
                        selected: [],
                        text: "",
                      };
                      const selected = currentAns.selected || [];
                      if (selected.includes(opt)) {
                        handleAnswerChange({
                          ...currentAns,
                          selected: selected.filter((a: string) => a !== opt),
                        });
                      } else {
                        handleAnswerChange({
                          ...currentAns,
                          selected: [...selected, opt],
                        });
                      }
                    }}
                  >
                    <Checkbox
                      checked={
                        answers[currentQuestion]?.selected?.includes(opt) ||
                        false
                      }
                      onCheckedChange={() => {}}
                      className="accent-blue-600 pointer-events-none"
                    />
                    <label className="cursor-pointer">{opt}</label>
                  </div>
                ))}
              </div>
              <label className="mt-4">{currentQ.descriptiveQuestion}</label>
              <Input
                // placeholder={currentQ.descriptiveQuestion}
                value={answers[currentQuestion]?.text || ""}
                onChange={(e) => {
                  const currentAns = answers[currentQuestion] || {
                    selected: [],
                    text: "",
                  };
                  handleAnswerChange({ ...currentAns, text: e.target.value });
                }}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 rounded-md "
              />
            </>
          )}

          {/* single_with_text
          {currentQ.type === "single_with_text" && currentQ.options && (
            <>
              <div className="flex flex-col gap-2">
                <RadioGroup
                  value={answers[currentQuestion].selected || ""}
                  // onValueChange={handleAnswerChange}
                  onValueChange={() => {
                    const currentAns = answers[currentQuestion] || {
                      selected: "",
                      text: "",
                    };
                    const selected = currentAns.selected || "";
                    // if (selected.includes(opt)) {
                    //   handleAnswerChange({
                    //     ...currentAns,
                    //     selected: selected.filter((a: string) => a !== opt),
                    //   });
                    // } else {
                    handleAnswerChange({
                      ...currentAns,
                      selected: selected,
                    });
                    // }
                  }}
                  className="flex flex-col gap-2"
                  dir="rtl"
                >
                  {currentQ.options.map((opt) => (
                    <div
                      key={opt}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleAnswerChange(opt)} // کلیک روی کل ردیف
                    >
                      <RadioGroupItem
                        value={opt}
                        id={opt}
                        className="accent-blue-600 pointer-events-none"
                      />
                      <label htmlFor={opt} className="cursor-pointer">
                        {opt}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <label className="mt-4">{currentQ.descriptiveQuestion}</label>
              <Input
                // placeholder={currentQ.descriptiveQuestion}
                value={answers[currentQuestion]?.text || ""}
                onChange={(e) => {
                  const currentAns = answers[currentQuestion] || {
                    selected: [],
                    text: "",
                  };
                  handleAnswerChange({ ...currentAns, text: e.target.value });
                }}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 rounded-md "
              />
            </>
          )} */}

          {/* single_with_text
          {currentQ.type === "single_with_text" && currentQ.options && (
            <>
              <div className="flex flex-col gap-2">
                <RadioGroup
                  value={answers[currentQuestion]?.selected || ""}
                  onValueChange={(value) => {
                    const currentAns = answers[currentQuestion] || {
                      selected: "",
                      text: "",
                    };

                    handleAnswerChange({
                      ...currentAns,
                      selected: value,
                    });
                  }}
                  className="flex flex-col gap-2"
                  dir="rtl"
                >
                  {currentQ.options.map((opt) => (
                    <div
                      key={opt}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 cursor-pointer"
                    >
                      <RadioGroupItem
                        value={opt}
                        id={opt}
                        className="accent-blue-600"
                      />
                      <label htmlFor={opt} className="cursor-pointer">
                        {opt}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <label className="mt-4">{currentQ.descriptiveQuestion}</label>

              <Input
                value={answers[currentQuestion]?.text || ""}
                onChange={(e) => {
                  const currentAns = answers[currentQuestion] || {
                    selected: "",
                    text: "",
                  };

                  handleAnswerChange({
                    ...currentAns,
                    text: e.target.value,
                  });
                }}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 rounded-md"
              />
            </>
          )} */}
          {/* single_with_text */}
          {currentQ.type === "single_with_text" && currentQ.options && (
            <>
              <div className="flex flex-col gap-2">
                <RadioGroup
                  value={answers[currentQuestion]?.selected[0] || ""}
                  onValueChange={(value) => {
                    const currentAns = answers[currentQuestion] || {
                      selected: [],
                      text: "",
                    };

                    handleAnswerChange({
                      ...currentAns,
                      selected: [value],
                    });
                  }}
                  className="flex flex-col gap-2"
                  dir="rtl"
                >
                  {currentQ.options.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        const currentAns = answers[currentQuestion] || {
                          selected: [],
                          text: "",
                        };

                        handleAnswerChange({
                          ...currentAns,
                          selected: [opt],
                        });
                      }}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition hover:bg-blue-50
          `}
                    >
                      <RadioGroupItem
                        value={opt}
                        id={opt}
                        className="accent-blue-600 pointer-events-none"
                      />
                      <label htmlFor={opt} className="cursor-pointer w-full">
                        {opt}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <label className="mt-4">{currentQ.descriptiveQuestion}</label>

              <Input
                value={answers[currentQuestion]?.text || ""}
                onChange={(e) => {
                  const currentAns = answers[currentQuestion] || {
                    selected: "",
                    text: "",
                  };

                  handleAnswerChange({
                    ...currentAns,
                    text: e.target.value,
                  });
                }}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 rounded-md"
              />
            </>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-gray-500 hover:text-red-500 cursor-pointer"
          >
            انصراف
          </Button>

          <div className="flex gap-3">
            {currentQuestion > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
              >
                قبلی
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentQuestion < survey.questions.length - 1
                ? "بعدی"
                : "ثبت نهایی"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
