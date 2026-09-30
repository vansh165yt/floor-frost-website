import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import CosmicEffects from "@/components/CosmicEffects";
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
  title: "FLOOR FROST | Official Gaming & Tech Universe",
  description: "Official Floor Frost gaming ecosystem, live statistics, community hub and web projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://img.youtube.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.discordapp.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://cdn.discordapp.com" />
      </head>
      <body className="min-h-full flex flex-col bg-[#07040d]">
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
        <CosmicEffects />
        {children}
      </body>
    </html>
  );
}
