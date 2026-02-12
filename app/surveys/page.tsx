"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyList from "@/components/SurveyList";

export default function SurveysPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (!storedUserInfo) {
      router.push("/");
      return;
    } else {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">نظرسنجی‌ها</h1>
            {userInfo && (
              <p className="text-gray-600 mt-2">
                خوش آمدید، {userInfo.firstName} {userInfo.lastName}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            خروج
          </button>
        </div>

        {/* Survey List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <SurveyList />
        </div>
      </div>
    </div>
  );
}
