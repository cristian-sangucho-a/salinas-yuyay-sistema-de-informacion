"use client";

import React, { useState } from "react";
import Button from "@atoms/Button";
import Title from "@atoms/Title";
import { Search, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface Persona {
  id?: string;
  cedula: string;
  razon_social: string; // Nombre completo
  email: string;
  telefonos: string;
  direccion: string;
  tipo: "N" | "J"; // Natural o Jurídica
  es_cliente: boolean;
  es_proveedor: boolean;
}

export default function CheckoutForm() {
  const [cedula, setCedula] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Form state for new user registration
  const [formData, setFormData] = useState({
    razon_social: "",
    email: "",
    telefonos: "",
    direccion: "",
  });

  const handleSearchPersona = async () => {
    if (!cedula) {
      setError("Por favor ingrese una cédula o RUC.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPersona(null);
    setIsNewUser(false);

    try {
      const response = await fetch(`/api/contifico/persona/${cedula}`);

      if (!response.ok) {
        // Si es 404, es usuario nuevo
        if (response.status === 404) {
          setIsNewUser(true);
          setError("Usuario no encontrado. Por favor complete el registro.");
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error al consultar la API (${response.status})`
        );
      }

      const data = await response.json();

      // La API de Contifico a veces devuelve un array o un objeto directo dependiendo del endpoint
      // Asumimos que nuestro proxy devuelve el objeto persona o null
      if (data && (data.id || data.cedula)) {
        setPersona(data);
      } else {
        setIsNewUser(true);
        setError("Usuario no encontrado. Por favor complete el registro.");
      }
    } catch (err) {
      console.error(err);
      // Si falla, asumimos que no existe o hubo error, permitimos registro manual
      setIsNewUser(true);
      setError(
        "No se pudo verificar la cédula. Puede registrarse manualmente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Crear persona en Contifico
      const newPersona = {
        ...formData,
        cedula,
        tipo: cedula.length === 13 ? "J" : "N",
        es_cliente: true,
        es_proveedor: false,
      };

      const createResponse = await fetch("/api/contifico/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPersona),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || "Error al crear la persona");
      }

      const createdPersona = await createResponse.json();
      setPersona(createdPersona);
      setIsNewUser(false);

      alert("¡Usuario registrado correctamente!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al registrar el usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeOrder = () => {
    if (!persona) return;
    // Lógica para finalizar pedido con usuario existente
    alert(
      `Pedido procesado para: ${persona.razon_social}\n(Integración de Pedido Pendiente)`
    );
  };

  return (
    <div className="bg-base-100 p-6 md:p-8 rounded-lg border border-base-200 shadow-sm h-fit sticky top-24">
      <Title variant="h3" className="mb-6 font-bold">
        Datos del Cliente
      </Title>

      {/* Búsqueda de Cédula */}
      <div className="form-control w-full mb-6">
        <label className="label">
          <span className="label-text font-medium">Cédula o RUC</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ingrese su identificación"
            className="input input-bordered w-full focus:input-primary"
            disabled={!!persona}
          />
          {!persona && (
            <Button
              onClick={handleSearchPersona}
              variant="primary"
              disabled={isLoading || !cedula}
              className="shrink-0"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            </Button>
          )}
          {persona && (
            <Button
              onClick={() => {
                setPersona(null);
                setCedula("");
                setIsNewUser(false);
                setFormData({
                  razon_social: "",
                  email: "",
                  telefonos: "",
                  direccion: "",
                });
              }}
              variant="ghost"
              className="shrink-0 text-error"
            >
              Cambiar
            </Button>
          )}
        </div>
        {error && (
          <div
            className={`mt-2 text-sm flex items-center gap-1 ${
              isNewUser ? "text-info" : "text-error"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Formulario de Registro (Solo si es usuario nuevo) */}
      {isNewUser && (
        <form
          onSubmit={handleRegisterAndSubmit}
          className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="alert alert-info shadow-sm text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>
              Usuario nuevo. Por favor complete sus datos para continuar.
            </span>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">
                Nombre Completo / Razón Social
              </span>
            </label>
            <input
              type="text"
              name="razon_social"
              value={formData.razon_social}
              onChange={handleInputChange}
              className="input input-bordered w-full focus:input-primary"
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Correo Electrónico</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input input-bordered w-full focus:input-primary"
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Teléfono</span>
            </label>
            <input
              type="tel"
              name="telefonos"
              value={formData.telefonos}
              onChange={handleInputChange}
              className="input input-bordered w-full focus:input-primary"
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Dirección</span>
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="input input-bordered w-full focus:input-primary"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Registrando...
              </>
            ) : (
              "Registrar y Finalizar Compra"
            )}
          </Button>
        </form>
      )}

      {/* Resumen de Usuario Existente */}
      {persona && (
        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-base-200/50 p-4 rounded-lg border border-base-200 space-y-2">
            <div className="flex items-center gap-2 text-success font-medium mb-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cliente Verificado</span>
            </div>
            <div className="grid grid-cols-1 gap-1 text-sm">
              <p>
                <span className="font-bold">Nombre:</span>{" "}
                {persona.razon_social}
              </p>
              <p>
                <span className="font-bold">Email:</span> {persona.email}
              </p>
              <p>
                <span className="font-bold">Teléfono:</span> {persona.telefonos}
              </p>
              <p>
                <span className="font-bold">Dirección:</span>{" "}
                {persona.direccion}
              </p>
            </div>
          </div>

          <Button
            onClick={handleFinalizeOrder}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Finalizar Compra
          </Button>
        </div>
      )}
    </div>
  );
}
