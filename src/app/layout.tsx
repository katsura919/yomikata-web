import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar03Page from "@/components/navbar-03/navbar-03";
import { ThemeProvider } from "@/components/theme-provider";
import BlurredBackground from "@/components/bg/blur-bg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yomikata - Manga Reader",
  description: "Browse and read manga online for free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative w-full h-full overflow-hidden`}
      >
        {/* Blurred Background */}
        <BlurredBackground />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar03Page /> {/* Navbar on all pages */}
          <main className="relative w-full min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
