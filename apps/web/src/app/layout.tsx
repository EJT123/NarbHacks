import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DailyForm - Your Personal Fitness & Wellness Tracker",
  description: "Track your daily fitness, wellness, and health goals with DailyForm. Modern, intuitive, and powerful personal health tracking.",
  keywords: "fitness tracker, wellness, health, daily tracking, personal health, workout tracker",
  authors: [{ name: "DailyForm Team" }],
  openGraph: {
    title: "DailyForm - Your Personal Fitness & Wellness Tracker",
    description: "Track your daily fitness, wellness, and health goals with DailyForm.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
