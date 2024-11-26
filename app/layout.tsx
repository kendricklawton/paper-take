import type { Metadata } from "next";
import Header from "./components/Header"
import ProviderWrapper from "./providers/ProviderWrapper";
import Info from "./components/Info";
import GoogleAdsense from "./components/GoogleAdsense";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://idea.machinename.dev"),
  title: 'Machine Name — Idea',
  description: 'Welcome to Machine Name — Idea, your online tool for effortless idea creation. Designed with a minimalist approach, our web app allows you to focus on your ideas without the clutter. Easily jot down thoughts, organize tasks, and manage projects in a clean, intuitive interface. Start using Paper Take today and transform ideas into reality.',
  keywords: "innovation, showcase, open source, projects, technology, creative solutions, paper take",
  authors: [
    { name: "Machine Name" }
  ],
  openGraph: { 
    title: 'Machine Name — Idea',
    description: 'Welcome to Machine Name — Idea, your online tool for effortless idea creation. Designed with a minimalist approach, our web app allows you to focus on your ideas without the clutter. Easily jot down thoughts, organize tasks, and manage projects in a clean, intuitive interface. Start using Paper Take today and transform ideas into reality.',
    url: "https://idea.machinename.dev",
    siteName: 'Machine Name — Idea',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAdsense/>
        <ProviderWrapper>
          <Header />
          {children}
          <Info />
        </ProviderWrapper>
        {/* <footer>
          <p>&copy; {new Date().getFullYear()} Machine Name. All rights reserved.</p>
        </footer> */}
      </body>
    </html>
  );
}