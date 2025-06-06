import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Hisaab",
  description: "Manage your financial life smartly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
