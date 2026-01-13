import type { Metadata } from "next";
import CheckoutStepper from "@components/productivo/tienda/checkout/CheckoutStepper";
import { PageHeader } from "@components/productivo/tienda";

export const metadata: Metadata = {
  title: "Finalizar Compra | Salinas Yuyay",
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
        <CheckoutStepper />
      </div>
    </main>
  );
}
