import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BENBA WAVE OKINAWA | 沖縄プライベートSUPツアー",
  description: "沖縄の海をプライベートで楽しむ1組限定のSUPツアー。恩納村・名護市・金武町で開催。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
