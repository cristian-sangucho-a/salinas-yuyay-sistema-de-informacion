"use client";

import React, { useState, useEffect } from "react";
import { data as postalData } from "ecuador-postal-codes";
import Title from "@atoms/Title";
import Button from "@atoms/Button";

interface AddressData {
  provincia: string;
  ciudad: string;
  callePrincipal: string;
  calleSecundaria: string;
  referencia: string;
  codigoPostal?: string;
}

interface PostalCity {
  name: string;
}

interface PostalProvince {
  name: string;
  cities: PostalCity[];
}

interface CheckoutAddressProps {
  initialData?: AddressData | null;
  onNext: (data: AddressData) => void;
  onBack: () => void;
}

export default function CheckoutAddress({
  initialData,
  onNext,
  onBack,
}: CheckoutAddressProps) {
  const [provincia, setProvincia] = useState(initialData?.provincia || "");
  const [ciudad, setCiudad] = useState(initialData?.ciudad || "");
  const [callePrincipal, setCallePrincipal] = useState(
    initialData?.callePrincipal || ""
  );
  const [calleSecundaria, setCalleSecundaria] = useState(
    initialData?.calleSecundaria || ""
  );
  const [referencia, setReferencia] = useState(initialData?.referencia || "");

  const [ciudades, setCiudades] = useState<string[]>([]);

  // Cargar provincias
  const provincias =
    (postalData?.provinces as PostalProvince[])?.map((p) => p.name) || [];

  useEffect(() => {
    if (provincia) {
      const provData = (postalData?.provinces as PostalProvince[])?.find(
        (p) => p.name === provincia
      );
      if (provData && provData.cities) {
        setCiudades(provData.cities.map((c) => c.name));
      } else {
        setCiudades([]);
      }
    } else {
      setCiudades([]);
    }
  }, [provincia]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      provincia,
      ciudad,
      callePrincipal,
      calleSecundaria,
      referencia,
    });
  };

  return (
    <div className="bg-base-100 p-4 md:p-6 rounded-lg border border-base-200 shadow-sm">
      <Title variant="h3" className="mb-4 md:mb-6 font-bold text-lg md:text-xl">
        Dirección de envío
      </Title>

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Provincia *</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={provincia}
              onChange={(e) => {
                setProvincia(e.target.value);
                setCiudad("");
              }}
              required
            >
              <option value="">Seleccione una provincia</option>
              {provincias.map((p: string) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Ciudad *</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
              disabled={!provincia}
            >
              <option value="">Seleccione una ciudad</option>
              {ciudades.map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Calle Principal *</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={callePrincipal}
            onChange={(e) => setCallePrincipal(e.target.value)}
            placeholder="Ej: Av. 12 de Octubre"
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Calle Secundaria</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={calleSecundaria}
            onChange={(e) => setCalleSecundaria(e.target.value)}
            placeholder="Ej: Francisco Salazar"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Referencia *</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder="Ej: Casa color verde, frente al parque..."
            required
          ></textarea>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Atrás
          </Button>
          <Button type="submit" variant="primary">
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
}
