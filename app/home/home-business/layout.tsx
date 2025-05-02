import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "../../globals.css";
import Navbar from "@/components/home/Navbar";
import BusinessSidebar from "@/components/business-finance/BusinessSidebar";
import BusinessBottomBar from "@/components/business-finance/BusinessBottomBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Hazina",
  description: "Your All-in-One Financial Powerhouse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} bg-white`}>
        <Navbar />
        <BusinessSidebar/>

        {/* Main layout container with sidebar margin on md+ screens and bottom margin on mobile */}
        <div className="flex">
          <div className="w-full md:ml-[200px] pb-[80px]">
            {children}
          </div>
        </div>

        <BusinessBottomBar />
      </body>
    </html>
  );
}
