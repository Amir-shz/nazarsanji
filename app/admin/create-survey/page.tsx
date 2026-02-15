import SurveyBuilder from "@/components/SurveyBuilder";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateSurveyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin">
          <Button variant="outline" className="mb-6">
            بازگشت
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          ایجاد نظرسنجی جدید
        </h1>
        <SurveyBuilder />
      </div>
    </div>
  );
}
