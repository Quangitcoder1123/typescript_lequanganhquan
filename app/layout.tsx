import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý phòng trọ",
  description: "Hệ thống quản lý phòng trọ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
