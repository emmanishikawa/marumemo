import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "marumemo",
  description: "a sentimental gachapon machine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}