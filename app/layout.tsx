import type { Metadata } from "next";
import { Geist, Geist_Mono,Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";


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
  title: "Hazina ",
  description: "Your All-in-One Financial Powerhouse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}>
      <AuthProvider>
        {children}
        </AuthProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
