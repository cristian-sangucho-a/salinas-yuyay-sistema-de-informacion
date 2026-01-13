import "./globals.css";
import { Roboto } from "next/font/google";
import { Metadata } from "next";
import { SALINAS_YUYAY } from "../../utils/empresa";
import { SEO_CONFIG } from "../../utils/seo";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.root.metadataBase),
  title: SEO_CONFIG.root.title,
  description: SALINAS_YUYAY.descripcion,
  keywords: SEO_CONFIG.root.keywords,
  authors: [{ name: SALINAS_YUYAY.nombre }],
  creator: SALINAS_YUYAY.nombre,
  openGraph: {
    ...SEO_CONFIG.root.openGraph,
    description: SALINAS_YUYAY.descripcion,
    title:
      SEO_CONFIG.root.openGraph.siteName +
      " - Ecosistema de Desarrollo Comunitario",
  },
  twitter: {
    ...SEO_CONFIG.root.twitter,
    description: SALINAS_YUYAY.descripcion,
  },
  icons: {
    icon: SALINAS_YUYAY.logo,
    shortcut: SALINAS_YUYAY.logo,
    apple: SALINAS_YUYAY.logo,
  },
  robots: SEO_CONFIG.root.robots as Metadata["robots"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="salinas-yuyay">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
