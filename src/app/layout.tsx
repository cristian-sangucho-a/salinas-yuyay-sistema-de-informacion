import "./globals.css";
import { Roboto } from "next/font/google";
import { SALINAS_YUYAY } from "../../utils/empresa";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: " Salinas Yuyay",
  description: SALINAS_YUYAY.descripcion,
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
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
