"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adminLogout } from "@/lib/actions";
import { toPersianDate } from "@/lib/utils";

interface Survey {
  _id: string;
  name: string;
  endDate: Date;
  isActive: boolean;
  createdAt: string;
}
// const surveys: Survey[] = [
//   {
//     _id: "surv_001",
//     name: "نظرسنجی رضایت مشتریان",
//     endDate: new Date("2024-12-30T23:59:59.999Z"),
//     isActive: true,
//     createdAt: "2024-01-15T10:30:00.000Z",
//   },
//   {
//     _id: "surv_002",
//     name: "ارزیابی عملکرد کارکنان",
//     endDate: new Date("2024-11-15T23:59:59.999Z"),
//     isActive: false,
//     createdAt: "2024-02-20T14:45:00.000Z",
//   },
//   {
//     _id: "surv_003",
//     name: "نظرسنجی کیفیت محصولات",
//     endDate: new Date("2024-10-20T23:59:59.999Z"),
//     isActive: true,
//     createdAt: "2024-03-10T09:15:00.000Z",
//   },
//   {
//     _id: "surv_004",
//     name: "بررسی نیازهای آموزشی",
//     endDate: new Date("2024-09-05T23:59:59.999Z"),
//     isActive: false,
//     createdAt: "2024-01-05T11:20:00.000Z",
//   },
//   {
//     _id: "surv_005",
//     name: "نظرسنجی تجربه کاربری وبسایت",
//     endDate: new Date("2024-12-15T23:59:59.999Z"),
//     isActive: true,
//     createdAt: "2024-04-18T16:00:00.000Z",
//   },
//   {
//     _id: "surv_006",
//     name: "ارزیابی رویداد سالانه",
//     endDate: new Date("2024-08-30T23:59:59.999Z"),
//     isActive: false,
//     createdAt: "2024-02-28T13:10:00.000Z",
//   },
//   {
//     _id: "surv_007",
//     name: "نظرسنجی برنامه‌های وفاداری",
//     endDate: new Date("2024-11-30T23:59:59.999Z"),
//     isActive: true,
//     createdAt: "2024-03-22T10:45:00.000Z",
//   },
//   {
//     _id: "surv_008",
//     name: "بررسی رضایت بیماران",
//     endDate: new Date("2024-10-10T23:59:59.999Z"),
//     isActive: true,
//     createdAt: "2024-01-30T08:30:00.000Z",
//   },
//   {
//     _id: "surv_009",
//     name: "نظرسنجی بازخورد محصول جدید",
//     endDate: new Date("2024-09-25T23:59:59.999Z"),
//     isActive: false,
//     createdAt: "2024-04-05T12:15:00.000Z",
//   },
//   {
//     _id: "surv_010",
//     name: "ارزیابی سمینار تخصصی",
//     endDate: new Date("2024-12-05T23:59:59.999Z"),
//     isActive: true,
//     createdAt: "2024-03-15T14:20:00.000Z",
//   },
// ];

export default function AdminDashboard() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await fetch("/api/admin/survey");
      if (!response.ok) {
        router.push("/");
        return;
      }
      const data = await response.json();
      setSurveys(data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/survey/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSurveys(surveys.filter((s) => s._id !== id));
        setOpenDeleteId(null);
        alert("نظرسنجی حذف شد");
      } else {
        alert("خطا در حذف نظرسنجی");
      }
    } catch (error) {
      alert("خطا در حذف نظرسنجی");
    }
  };

  const handleLogout = async () => {
    await adminLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>درحال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">پنل ادمین</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            خروج
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link href="/admin/create-survey">
            <Button className="bg-blue-600 hover:bg-blue-700">
              ایجاد نظرسنجی جدید
            </Button>
          </Link>
        </div>

        {/* Surveys Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {surveys.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              هیچ نظرسنجی موجود نیست
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-right font-semibold">نام</th>
                    <th className="px-6 py-3 text-right font-semibold">
                      تاریخ پایان
                    </th>
                    <th className="px-6 py-3 text-right font-semibold">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right font-semibold">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.map((survey) => (
                    <tr
                      key={survey._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{survey.name}</td>
                      <td className="px-6 py-4">
                        {toPersianDate(new Date(survey.endDate))}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            survey.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {survey.isActive ? "فعال" : "غیرفعال"}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <Link href={`/admin/survey/${survey._id}`}>
                          <Button size="sm" variant="outline">
                            ویرایش
                          </Button>
                        </Link>
                        <Link href={`/admin/responses/${survey._id}`}>
                          <Button size="sm" variant="outline">
                            پاسخ‌ها
                          </Button>
                        </Link>
                        <a href={`/api/admin/export/${survey._id}`} download>
                          <Button size="sm" variant="outline">
                            دانلود
                          </Button>
                        </a>
                        <Dialog
                          open={openDeleteId === survey._id}
                          onOpenChange={(open) =>
                            setOpenDeleteId(open ? survey._id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              حذف
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg rounded-xl p-6 bg-white shadow-xl text-right [&>button]:hidden">
                            <DialogHeader>
                              <DialogTitle className=" text-right">
                                تأیید حذف
                              </DialogTitle>
                            </DialogHeader>
                            <p>آیا از حذف این نظرسنجی اطمینان دارید؟</p>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                onClick={() => setOpenDeleteId(null)}
                              >
                                لغو
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(survey._id)}
                              >
                                حذف
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
