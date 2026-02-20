import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soloi Castle - Royal Command",
  description: "Royal Command Centre Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Orbitron:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="text-white antialiased">{children}</body>
    </html>
  );
}
