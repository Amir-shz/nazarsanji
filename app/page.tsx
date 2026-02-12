"use client";

import { useState } from "react";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import AdminLoginForm from "@/components/AdminLoginForm";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            سیستم نظرسنجی
          </h1>
          <p className="text-lg text-gray-600">
            در نظرسنجی‌های موسسه شرکت کنید
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* Personal Info Section */}
          <div className="flex-1 max-w-lg">
            <PersonalInfoForm />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-gray-300 my-8"></div>

          {/* Admin Section */}
          <div className="flex-1 max-w-lg">
            {!showAdminLogin ? (
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">ادمین</h2>
                <p className="text-gray-600 mb-6">
                  اگر ادمین هستید، به پنل مدیریت وارد شوید
                </p>
                <Button
                  onClick={() => setShowAdminLogin(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  ورود به پنل ادمین
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  onClick={() => setShowAdminLogin(false)}
                  variant="outline"
                  className="mb-4 w-full"
                >
                  بازگشت
                </Button>
                <AdminLoginForm />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-600">
          <p>تمام حقوق محفوظ است © ۱۴۰۴</p>
        </div>
      </div>
    </div>
  );
}
