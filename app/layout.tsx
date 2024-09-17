import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import ProviderWrapper from "./providers/ProviderWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Note Project",
  description: "Notes & Projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProviderWrapper>
          <Header />
          {children}
        </ProviderWrapper>
        <footer>
          <div>
            <p>
              © 2024 Machine Name LLC. All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}









