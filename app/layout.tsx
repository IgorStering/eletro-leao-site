import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eletro Leão - Eletrônicos com Qualidade",
  description: "Catálogo de produtos eletrônicos: ar-condicionados, notebooks, smartphones e mais. Preços competitivos e qualidade garantida.",
  keywords: "eletrônicos, ar condicionado, notebook, smartphone, Eletro Leão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-black text-gray-400 text-center py-8 mt-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-orange-600 font-bold mb-2">Sobre Nós</h4>
                <p className="text-sm">Somos a maior loja de eletrônicos com as melhores marcas e preços.</p>
              </div>
              <div>
                <h4 className="text-orange-600 font-bold mb-2">Contato</h4>
                <p className="text-sm">
                  <a href="https://wa.me/5531999999999" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-500 transition">
                    💬 WhatsApp: (31) 9999-9999
                  </a>
                </p>
              </div>
              <div>
                <h4 className="text-orange-600 font-bold mb-2">Redes Sociais</h4>
                <p className="text-sm">📷 Instagram | 📘 Facebook | 𝕏 Twitter</p>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6">
              <p>&copy; 2026 Eletro Leão. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
