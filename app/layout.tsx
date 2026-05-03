import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import BottomNav from "@/components/BottomNav/BottomNav";
import GlobalElements from "@/components/GlobalElements";
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FEATURE_FLAGS } from "@/lib/config";


export const metadata: Metadata = {
  metadataBase: new URL("https://scammersofficial.in"),
  title: "Scammer Store | Cheap MLBB Diamond Top Up - Instant & Secure",
  description: "Scammer Store is the leading platform for cheap and instant Mobile Legends (MLBB) diamond top-ups. Secure payments, 24/7 automated delivery, and best prices guaranteed.",
  keywords: [
    "mlbb diamond top up", 
    "cheap mlbb diamonds", 
    "instant mlbb top up", 
    "mobile legends recharge", 
    "scammer store mlbb", 
    "mlbb top up indonesia", 
    "mlbb top up global", 
    "secure mlbb diamonds",
    "mlbb recharge india",
    "mlbb pins",
    "fast mlbb diamonds",
    "mobile legends bang bang diamonds"
  ],
  alternates: {
    canonical: "/",
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
  openGraph: {
    title: "Scammer Store | Cheap MLBB Diamond Top Up - Instant & Secure",
    description: "Scammer Store is the leading platform for cheap and instant Mobile Legends (MLBB) diamond top-ups. Secure payments, 24/7 automated delivery, and best prices guaranteed.",
    url: "https://scammersofficial.in",
    siteName: "Scammer Store",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scammer Store | Cheap MLBB Diamond Top Up - Instant & Secure",
    description: "Scammer Store is the leading platform for cheap and instant Mobile Legends (MLBB) diamond top-ups. Secure payments, 24/7 automated delivery, and best prices guaranteed.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Scammer Store",
              "url": "https://scammersofficial.in",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://scammersofficial.in/games?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Scammer Store",
              "url": "https://scammersofficial.in",
              "logo": "https://scammersofficial.in/logo.png",
              "description": "Leading platform for cheap and instant Mobile Legends (MLBB) diamond top-ups.",
              "sameAs": [
                "https://wa.me/9178521537"
              ]
            }),
          }}
        />
      </head>
      <body className="bg-black text-white">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>

          <Header />
          <main className="pt-14 pb-24 lg:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <GlobalElements />
        </GoogleOAuthProvider>

      </body>
      <GoogleAnalytics gaId="G-RBPY9YC6V6" />
      {/* <script src="https://quge5.com/88/tag.min.js" data-zone="191906" async data-cfasync="false"></script> */}
    </html>
  );
}
