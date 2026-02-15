export const metadata = {
  title: "پنل ادمین | سیستم نظرسنجی",
  description: "پنل مدیریت نظرسنجی‌ها",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-linear-to-br from-green-400 to-indigo-200 ">
      {children}
    </div>
  );
}
