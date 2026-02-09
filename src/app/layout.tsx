import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "출판사 지문",
  description:
    "작가의 지문과도 같은 감각적 글이 당신을 터치합니다. 지문 출판사의 엄선된 문학 작품을 만나보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
