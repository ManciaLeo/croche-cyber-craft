import type { Metadata } from "next";
import Script from "next/script";
import { supabase } from "@/lib/supabase";
import "./globals.css";
import ChatWidget from "@/app/components/ChatWidget";

export const metadata: Metadata = {
  title: "Fran Artes em Crochê",
  description: "Loja oficial de peças artesanais em crochê",
};

// Função para buscar o ID do GTM salvo no Supabase em tempo de execução
async function getGtmId() {
  try {
    const { data } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'gtm_id')
      .single();
    
    return data?.valor || null;
  } catch {
    return null;
  }
}
 
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtmId = await getGtmId();

  return (
    <html lang="pt-BR">
      <head>
        {/* Se o GTM estiver cadastrado no painel, injeta o script do Google */}
        {gtmId && (
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
        )}
      </head>
      <body className="bg-stone-50 text-stone-900 antialiased">
        {/* GTM NoScript (caso o navegador esteja com o JS desativado) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {children}
        <ChatWidget />
      </body>
    </html>
  );
}