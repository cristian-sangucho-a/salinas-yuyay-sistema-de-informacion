"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Check, ShoppingCart, User, MapPin, CreditCard } from "lucide-react";
import CheckoutCart from "./CheckoutCart";
import CheckoutForm from "./CheckoutForm";
import CheckoutAddress from "./CheckoutAddress";
import CheckoutSummary from "./CheckoutSummary";
import Button from "@atoms/Button";
import Title from "@atoms/Title";
import Text from "@atoms/Text";
import Alert from "@molecules/Alert";
import { useCart } from "@/context/CartContext";
import { ClientData, AddressData } from "@/lib/types/productivo";
import { sendOrderConfirmationEmail } from "@/lib/email-service";
import { createContificoPrefactura } from "@/lib/contifico";

const steps = [
  { id: 0, label: "Carrito", icon: ShoppingCart },
  { id: 1, label: "Datos", icon: User },
  { id: 2, label: "Envío", icon: MapPin },
  { id: 3, label: "Confirmar", icon: CreditCard },
];

export default function CheckoutStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const { items, clearCart, checkStock } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRef.current) {
      // Scroll al inicio del componente con un pequeño offset para el header si es necesario
      const yOffset = -100;
      const element = topRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleNextStep = async () => {
    // Validar Stock en el paso 0
    if (currentStep === 0) {
      setIsValidating(true);
      setValidationError(null);

      try {
        const validations = await Promise.all(
          items.map(async (item) => {
            if (!item.contificoId) return { item, valid: true };
            const valid = await checkStock(item.contificoId, item.quantity);
            return { item, valid };
          })
        );

        const invalidItem = validations.find((v) => !v.valid);

        if (invalidItem) {
          setValidationError(
            `Lo sentimos, el producto "${invalidItem.item.name}" no tiene suficiente stock disponible para la cantidad solicitada.`
          );
          setIsValidating(false);
          return;
        }
      } catch (error) {
        console.error("Error validating stock:", error);
        setValidationError(
          "Ocurrió un error verificando el stock. Por favor intente nuevamente."
        );
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleClientData = (data: ClientData) => {
    setClientData(data);
    handleNextStep();
  };

  const handleAddressData = (data: AddressData) => {
    setAddressData(data);
    handleNextStep();
  };

  const handleFinalize = async () => {
    if (!clientData || !addressData) return;
    setIsProcessing(true);

    try {
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Enviar correo de confirmación y crear prefactura en paralelo
      const [emailResult, prefacturaResult] = await Promise.all([
        sendOrderConfirmationEmail(clientData, addressData, items, total),
        createContificoPrefactura(clientData, addressData, items),
      ]);

      if (!prefacturaResult.success) {
        console.warn(
          "Advertencia: No se pudo crear la prefactura en Contífico",
          prefacturaResult.error
        );
        // No bloqueamos el flujo de éxito para el usuario, pero lo registramos
      }

      // Aquí iría la lógica para enviar el pedido al backend (DB)
      console.log("Finalizing order...", {
        clientData,
        addressData,
        items,
        emailResult,
        prefacturaResult,
      });

      clearCart();
      setIsSuccess(true);
    } catch (error) {
      console.error("Error finalizing order:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
          <Check className="w-12 h-12" />
        </div>
        <Title variant="h2" className="text-primary mb-4 font-bold">
          ¡Pedido Realizado con Éxito!
        </Title>
        <Text className="max-w-md mx-auto mb-8 text-lg">
          Gracias por tu compra, <strong>{clientData?.razon_social}</strong>.
          Hemos enviado un correo de confirmación a{" "}
          <strong>{clientData?.email}</strong>.
        </Text>
        <Link href="/tienda">
          <Button variant="primary" size="lg">
            Volver a la Tienda
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div ref={topRef} className="w-full max-w-5xl mx-auto">
      {/* Stepper Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <ul className="steps w-full md:w-auto flex-1">
          {steps.map((step) => (
            <li
              key={step.id}
              className={`step ${
                currentStep >= step.id ? "step-primary" : ""
              } transition-all duration-300 text-xs md:text-sm`}
              data-content={currentStep > step.id ? "✓" : step.id + 1}
            >
              <span
                className={`${
                  currentStep === step.id ? "font-bold" : "font-medium"
                } ml-2 ${
                  currentStep === step.id ? "block" : "hidden sm:block"
                }`}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Botón Continuar en Header (Solo visible en paso 0 si hay items) */}
        {currentStep === 0 && items.length > 0 && (
          <div className="hidden md:block">
            <Button
              onClick={handleNextStep}
              variant="primary"
              disabled={isValidating}
            >
              {isValidating ? "Verificando..." : "Continuar"}
            </Button>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {currentStep === 0 && (
          <div className="space-y-6">
            {validationError && (
              <Alert type="error" title="Stock Insuficiente" showIcon={true}>
                {validationError}
              </Alert>
            )}
            <CheckoutCart />
            {items.length > 0 && (
              <div className="flex justify-end md:hidden">
                <Button
                  onClick={handleNextStep}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isValidating}
                >
                  {isValidating ? "Verificando..." : "Continuar a Datos"}
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <CheckoutForm
                onNext={handleClientData}
                onBack={handlePrevStep}
                initialData={clientData}
              />
            </div>
            <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
              <CheckoutSummary />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <CheckoutAddress
                initialData={addressData}
                onNext={handleAddressData}
                onBack={handlePrevStep}
              />
            </div>
            <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
              <CheckoutSummary />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              {/* Alert/Info Banner */}
              <div className="alert alert-info shadow-sm bg-info/10 border-info/20 text-base-content">
                <Check className="w-5 h-5 text-info" />
                <span className="text-sm">
                  Por favor revisa que toda la información sea correcta antes de
                  confirmar.
                </span>
              </div>

              {/* Shipping Address Card */}
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body p-6">
                  <div className="flex justify-between items-start mb-4 border-b border-base-200 pb-3">
                    <h3 className="card-title text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Dirección de envío
                    </h3>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="btn btn-ghost btn-xs text-primary"
                    >
                      Cambiar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-base-content/60 text-xs uppercase tracking-wider font-semibold mb-1">
                        Ubicación
                      </p>
                      <p className="font-medium text-base">
                        {addressData?.ciudad}, {addressData?.provincia}
                      </p>
                    </div>
                    <div>
                      <p className="text-base-content/60 text-xs uppercase tracking-wider font-semibold mb-1">
                        Calles
                      </p>
                      <p className="font-medium text-base">
                        {addressData?.callePrincipal}{" "}
                        {addressData?.calleSecundaria
                          ? `y ${addressData.calleSecundaria}`
                          : ""}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-base-content/60 text-xs uppercase tracking-wider font-semibold mb-1">
                        Referencia
                      </p>
                      <p className="italic text-base-content/80 bg-base-200/50 p-2 rounded">
                        &quot;{addressData?.referencia}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Info Card */}
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body p-6">
                  <div className="flex justify-between items-start mb-4 border-b border-base-200 pb-3">
                    <h3 className="card-title text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Datos de facturación
                    </h3>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="btn btn-ghost btn-xs text-primary"
                    >
                      Cambiar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-base-content/60 text-xs uppercase tracking-wider font-semibold mb-1">
                        Cliente / Razón Social
                      </p>
                      <p className="font-medium text-base">
                        {clientData?.razon_social}
                      </p>
                    </div>
                    <div>
                      <p className="text-base-content/60 text-xs uppercase tracking-wider font-semibold mb-1">
                        Identificación (CI/RUC)
                      </p>
                      <p className="font-medium text-base">
                        {clientData?.cedula}
                      </p>
                    </div>
                    <div>
                      <p className="text-base-content/60 text-xs uppercase tracking-wider font-semibold mb-1">
                        Correo Electrónico
                      </p>
                      <p className="font-medium text-base">
                        {clientData?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-base-content/60 text-xs uppercase tracking-wider font-semibold mb-1">
                        Teléfono
                      </p>
                      <p className="font-medium text-base">
                        {clientData?.telefonos}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Placeholder */}
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body p-6">
                  <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Método de pago
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-base-200/30 rounded-lg border border-base-200 border-dashed">
                    <div className="badge badge-primary badge-outline p-3 whitespace-nowrap shrink-0">
                      Transferencia / Efectivo
                    </div>
                    <span className="text-sm text-base-content/70">
                      Nos pondremos en contacto contigo para coordinar el pago y
                      la entrega una vez confirmado el pedido.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-start pt-4">
                <Button variant="outline" onClick={handlePrevStep}>
                  Atrás
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1 lg:sticky lg:top-24 flex flex-col gap-4 max-h-[calc(100vh-8rem)]">
              <div className="overflow-y-auto custom-scrollbar -mr-2 pr-2">
                <CheckoutSummary />
              </div>
              <div className="shrink-0 bg-base-100 p-1">
                <Button
                  onClick={handleFinalize}
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Procesando..." : "Confirmar pedido"}
                </Button>
                <p className="text-xs text-center text-base-content/60 mt-2">
                  Al confirmar, aceptas nuestros términos y condiciones de
                  venta.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
