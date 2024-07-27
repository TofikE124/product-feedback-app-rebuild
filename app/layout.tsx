import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.scss";

const jost = Jost({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Product Feedback App",
  description: "Product Feedback App by Tofik Elias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jost.className}>
        <div className="w-full min-h-screen bg-cloud-white">{children}</div>
      </body>
    </html>
  );
}
