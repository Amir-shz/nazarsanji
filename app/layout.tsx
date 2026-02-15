import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "سیستم نظرسنجی",
  description: "سیستم جامع مدیریت نظرسنجی‌ها",
};

const IranSans = localFont({
  src: [
    {
      path: "../fonts/IRANSansX-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/IRANSansX-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/IRANSansX-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/IRANSansX-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/IRANSansX-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/IRANSansX-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/IRANSansX-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/IRANSansX-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/IRANSansX-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--iranSans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={` bg-linear-to-br from-green-400 to-indigo-200  text-gray-900 ${IranSans.className} ${IranSans.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
