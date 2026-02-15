"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PersonalInfoForm() {
  const [nationalCode, setNationalCode] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    localStorage.setItem("userInfo", JSON.stringify({ nationalCode }));

    router.push("/surveys");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        شرکت در نظرسنجی‌ها
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            کد ملی
          </label>
          <Input
            type="text"
            name="nationalCode"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
            placeholder="کد ملی خود را وارد کنید"
            required
            maxLength={10}
            pattern="\d{10}"
            className="text-right ltr"
            title="کد ملی باید ۱۰ رقمی باشد"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !nationalCode}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {loading ? "درحال ثبت..." : "تایید و ادامه"}
        </Button>
      </form>
    </div>
  );
}
