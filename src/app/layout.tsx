import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://useprontu.online"),
  title: {
    default: "Prontu — Seu trabalho pronto. De verdade.",
    template: "%s | Prontu"
  },
  description: "Cola o enunciado. Em 3 minutos, PDF na mão. A melhor IA para estudantes criarem trabalhos escolares estruturados em ABNT.",
  keywords: ["trabalho escolar IA", "fazer trabalho com IA", "PDF escola", "trabalho pronto ABNT", "Prontu", "gerador de trabalho escolar"],
  openGraph: {
    title: "Prontu — Seu trabalho pronto. De verdade.",
    description: "Cola o enunciado. Em 3 minutos, PDF na mão.",
    url: "https://useprontu.online",
    siteName: "Prontu",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-body antialiased text-ink bg-paper">
        {children}
      </body>
    </html>
  );
}
