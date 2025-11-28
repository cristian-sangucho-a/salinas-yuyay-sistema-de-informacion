import type { Metadata } from "next";
import CheckoutForm from "@components/productivo/tienda/checkout/CheckoutForm";
import CheckoutCart from "@components/productivo/tienda/checkout/CheckoutCart";
import { PageHeader } from "@components/productivo/tienda";

export const metadata: Metadata = {
  title: "Finalizar Compra | SAISAL",
  description: "Completa tu pedido de productos artesanales.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-base-100 pb-12">
      <PageHeader
        title="Finalizar Compra"
        breadcrumbs={[
          { label: "Tienda", href: "/tienda" },
          { label: "Checkout" },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Carrito Editable */}
          <div className="lg:col-span-2">
            <CheckoutCart />
          </div>

          {/* Columna Derecha: Formulario de Cliente */}
          <div className="lg:col-span-1">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </main>
  );
}
