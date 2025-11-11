import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { type Metadata } from "next";

import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TezCart - 3D eCommerce Marketplace",
  description: "Next-generation eCommerce with immersive 3D and AR experiences",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
