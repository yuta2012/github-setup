import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Car Share | 家族の車予約",
  description: "家族みんなの車の予定をひとつのカレンダーで管理します。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
