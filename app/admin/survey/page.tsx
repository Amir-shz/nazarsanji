import SurveyBuilder from "@/components/SurveyBuilder";

export default function AdminSurveyPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-xl font-bold mb-6">ایجاد نظرسنجی جدید</h1>
      <SurveyBuilder />
    </div>
  );
}
