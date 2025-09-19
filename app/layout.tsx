import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";

export const metadata: Metadata = {
  title: "Miss Tourism Uganda - The Queen",
  description: "Experience the beauty of Uganda through the eyes of Miss Tourism Uganda. Discover culture, fashion, travel diaries, and join our vibrant community of tourism enthusiasts.",
  keywords: "Miss Tourism Uganda, Uganda tourism, African beauty, cultural heritage, travel, fashion, community",
  authors: [{ name: "Miss Tourism Uganda" }],
  openGraph: {
    title: "Miss Tourism Uganda - The Queen",
    description: "Experience the beauty of Uganda through the eyes of Miss Tourism Uganda",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
