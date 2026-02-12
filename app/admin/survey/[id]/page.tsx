import SurveyBuilder from "@/components/SurveyBuilder";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditSurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const resolveParams = async () => {
  //   return await params;
  // };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin">
          <Button variant="outline" className="mb-6">
            بازگشت
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          ویرایش نظرسنجی
        </h1>
        <EditSurveyContent params={params} />
      </div>
    </div>
  );
}

function EditSurveyContent({ params }: { params: Promise<{ id: string }> }) {
  // const resolveParams = async () => {
  //   return await params;
  // };

  return (
    <div className="space-y-4">
      <SurveyBuilderWrapper params={params} />
    </div>
  );
}

async function SurveyBuilderWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SurveyBuilder surveyId={id} isEdit={true} />;
}
