import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from 'next/font/google';

export const metadata: Metadata = {
  title: 'SkyFitnessPro',
  description: 'Фитнес-платформа для тренировок',
};

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${roboto.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}