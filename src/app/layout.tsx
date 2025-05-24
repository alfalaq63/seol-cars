import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Providers } from './providers';
import { AdvertisementsTicker } from '@/components/advertisements-ticker';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "سيول ليبيا للسيارات",
  description: "موقع شركة سيول ليبيا للسيارات",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pb-24">{children}</main>
            <Footer />
            <AdvertisementsTicker />
          </div>
        </Providers>
      </body>
    </html>
  );
}
