"use client";

import { useState } from "react";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import AdminLoginForm from "@/components/AdminLoginForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-400 to-indigo-200 py-6 px-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center  mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              سامانه نظرسنجی
            </h1>
            <p className="text-lg text-gray-600">
              نظر کارکنان، زیربنای تصمیم گیری های موثر موسسه
            </p>
          </div>

          <div className="flex justify-center items-center mt-4">
            <Image alt="logo" src="/Arm.png" width={100} height={100} />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-8 justify-center items-start">
          {/* Personal Info Section */}
          <div className="w-full col-span-4">
            <PersonalInfoForm />
          </div>

          {/* Divider */}
          {/* <div className="hidden lg:block w-px bg-gray-300 my-8"></div> */}

          {/* Admin Section */}
          <div className="w-full col-span-2">
            {!showAdminLogin ? (
              <div className="  bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  پنل مدیریت
                </h2>
                <Button
                  onClick={() => setShowAdminLogin(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  ورود به پنل مدیر
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
