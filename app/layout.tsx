import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ChatWidget from "@/app/components/ChatWidget";

export const metadata: Metadata = {
  title: "Fran Artes em Crochê",
  description: "Loja oficial de peças artesanais em crochê",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Colocamos o ID fixo aqui, sem depender do banco de dados!
  const gtmId = "GTM-K6XH962B";

  return (
    <html lang="pt-BR">
      <head>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      </head>
      <body className="bg-stone-50 text-stone-900 antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}
        <ChatWidget />
      </body>
    </html>
  );
}