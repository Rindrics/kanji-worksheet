import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_CONFIG } from "@/constants/app";
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
  title: APP_CONFIG.SERVICE_NAME,
  description: APP_CONFIG.DESCRIPTION,
  keywords: [
    '漢字', '漢字練習', 'ワークシート', '漢字ドリル',
    '部首', '漢字部品', '書き順', '筆順', '寺子屋',
    '小学生', '教育', '学習', '無料', '漢文素読',
    '印刷', 'プリント', '家庭学習', 'KanjiVG'
  ],
  authors: [{ name: '林晃', url: 'https://akirahayashi.com/about/' }],
  creator: 'Rindrics',
  publisher: '林晃',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: APP_CONFIG.SITE_URL,
    title: APP_CONFIG.SERVICE_NAME,
    description: APP_CONFIG.DESCRIPTION,
    siteName: APP_CONFIG.SERVICE_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: APP_CONFIG.SERVICE_NAME,
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: APP_CONFIG.SERVICE_NAME,
    description: APP_CONFIG.DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@Rindrics',
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },

  // その他
  metadataBase: new URL(APP_CONFIG.SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
