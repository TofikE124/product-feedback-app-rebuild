import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.scss";
import QueryClientWrapper from "@/providers/QueryClientWrapper";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import NextSessionWrapper from "@/providers/NextSessionWrapper";
import { PanelProvider } from "@/providers/PanelProvider";
import Panels from "@/layout/Panels";

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
        <div className="w-full min-h-screen bg-cloud-white">
          <Toaster></Toaster>
          <QueryClientWrapper>
            <NextSessionWrapper>
              <PanelProvider>
                {children}
                <Panels></Panels>
              </PanelProvider>
            </NextSessionWrapper>
            <ReactQueryDevtools></ReactQueryDevtools>
          </QueryClientWrapper>
        </div>
      </body>
    </html>
  );
}
