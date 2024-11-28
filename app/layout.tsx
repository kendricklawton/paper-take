import type { Metadata } from "next";
import Head from "next/head";
import Header from "./components/Header"
import Info from "./components/Info";
import ProviderWrapper from "./providers/ProviderWrapper";
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

const id = process.env.GOOGLE_AD_SENSE_ID as string;
const url = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <Head>
          <script
            async
            src={url}
            crossOrigin="anonymous"
          />
        </Head>
        <ProviderWrapper>
          <Header />
          {children}
          <Info />
        </ProviderWrapper>
      </body>
    </html>
  );
}