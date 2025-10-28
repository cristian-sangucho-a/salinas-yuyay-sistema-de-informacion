import './globals.css';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
});

export const metadata = {
    title: 'SAISAL - Salinas Yuyay',
    description: 'Sistema de Archivo e Información de Salinas',
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