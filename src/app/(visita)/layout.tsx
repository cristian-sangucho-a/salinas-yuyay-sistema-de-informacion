import "../globals.css";
import Footer from "./Footer";
import Navbar from "./Header";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@components/productivo/tienda/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <CartDrawer />
      <Footer />
    </CartProvider>
  );
}
