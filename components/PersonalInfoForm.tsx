"use client";

import { useState } from "react";
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
import { SERVICE_LOCATIONS } from "@/lib/config";

export default function PersonalInfoForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    localStorage.setItem(
      "userInfo",
      JSON.stringify({ firstName, lastName, nationalCode, serviceLocation })
    );

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
            نام
          </label>
          <Input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="نام خود را وارد کنید"
            required
            className="text-right"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نام خانوادگی
          </label>
          <Input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="نام خانوادگی خود را وارد کنید"
            required
            className="text-right"
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            محل خدمت
          </label>
          <Select
            name="serviceLocation"
            value={serviceLocation}
            onValueChange={setServiceLocation}
            required
            dir="rtl"
          >
            <SelectTrigger className="w-full min-w-80 text-right">
              <SelectValue placeholder="یک مورد انتخاب کنید" />
            </SelectTrigger>
            <SelectContent position="popper">
              {SERVICE_LOCATIONS.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )} */}

        <Button
          type="submit"
          disabled={
            loading ||
            !serviceLocation ||
            !firstName ||
            !lastName ||
            !nationalCode
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {loading ? "درحال ثبت..." : "تایید و ادامه"}
        </Button>
      </form>
    </div>
  );
}
