"use client";

import Button from "@atoms/Button";
import Card from "@molecules/Card";
import Alert from "@molecules/Alert";
import SearchBar from "@molecules/SearchBar";

export default function Home() {
  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
  };

  return (
    <div className="bg-base-100 min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content">
            Bienvenido al{" "}
            <span className="text-primary">
              Sistema de Información Salinas Yuyay
            </span>
          </h1>
          <p className="text-lg text-base-content/70">
            Paleta de colores inspirada en la cultura andina
          </p>
        </div>

        {/* SearchBar Demo */}
        <Card title="Búsqueda" description="Componente SearchBar (Molecule)">
          <SearchBar
            placeholder="Buscar productos, usuarios..."
            onSearch={handleSearch}
          />
        </Card>

        {/* Botones DaisyUI usando componente Button */}
        <Card
          title="Componentes Button (Atoms)"
          description="Botones reutilizables con variantes"
        >
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Botón Primary</Button>
            <Button variant="secondary">Botón Secondary</Button>
            <Button variant="accent">Botón Accent</Button>
            <Button variant="neutral">Botón Neutral</Button>
            <Button variant="success">Botón Success</Button>
            <Button variant="warning">Botón Warning</Button>
            <Button variant="error">Botón Error</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="secondary" size="md">
              Medium
            </Button>
            <Button variant="accent" size="lg">
              Large
            </Button>
          </div>
        </Card>

        {/* Alertas usando componente Alert */}
        <Card
          title="Componentes Alert (Molecules)"
          description="Alertas con iconos y variantes"
        >
          <div className="space-y-3">
            <Alert type="info" title="Información">
              Información importante del sistema
            </Alert>
            <Alert type="success" title="Éxito">
              ¡Operación completada con éxito!
            </Alert>
            <Alert type="warning" title="Advertencia">
              Revisa esta información antes de continuar
            </Alert>
            <Alert type="error" title="Error">
              Algo salió mal, por favor intenta nuevamente
            </Alert>
            <Alert type="info" showIcon={false}>
              Alerta sin icono
            </Alert>
          </div>
        </Card>

        {/* Paleta de Colores Base */}
        <Card
          title="Colores Base"
          description="Tonos beige y arena del tema Salinas Yuyay"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-base-100 p-6 rounded-lg border border-base-300">
              <div className="font-mono text-sm text-base-content">
                base-100
              </div>
              <div className="text-xs text-base-content/60 mt-1">
                Beige sal - Fondo principal
              </div>
            </div>
            <div className="bg-base-200 p-6 rounded-lg border border-base-300">
              <div className="font-mono text-sm text-base-content">
                base-200
              </div>
              <div className="text-xs text-base-content/60 mt-1">
                Beige oscuro - Fondos secundarios
              </div>
            </div>
            <div className="bg-base-300 p-6 rounded-lg border border-base-300">
              <div className="font-mono text-sm text-base-content">
                base-300
              </div>
              <div className="text-xs text-base-content/60 mt-1">
                Arena - Bordes y divisores
              </div>
            </div>
          </div>
        </Card>

        {/* Colores Temáticos */}
        <Card
          title="Colores Temáticos"
          description="Paleta completa de colores del tema"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-primary text-primary-content p-6 rounded-lg shadow-md">
              <div className="font-bold text-lg">Primary</div>
              <div className="text-sm opacity-90 mt-1">
                Marrón tierra (#5A1E02)
              </div>
              <div className="text-xs opacity-75 mt-2">
                Para acciones principales
              </div>
            </div>
            <div className="bg-secondary text-secondary-content p-6 rounded-lg shadow-md">
              <div className="font-bold text-lg">Secondary</div>
              <div className="text-sm opacity-90 mt-1">
                Marrón arcilla (#8B3C10)
              </div>
              <div className="text-xs opacity-75 mt-2">
                Para acciones secundarias
              </div>
            </div>
            <div className="bg-accent text-accent-content p-6 rounded-lg shadow-md">
              <div className="font-bold text-lg">Accent</div>
              <div className="text-sm opacity-90 mt-1">
                Verde andino (#7CB856)
              </div>
              <div className="text-xs opacity-75 mt-2">
                Para destacar elementos
              </div>
            </div>
            <div className="bg-neutral text-neutral-content p-6 rounded-lg shadow-md">
              <div className="font-bold text-lg">Neutral</div>
              <div className="text-sm opacity-90 mt-1">
                Ocre salino (#D6A77A)
              </div>
              <div className="text-xs opacity-75 mt-2">
                Para elementos neutrales
              </div>
            </div>
            <div className="bg-success text-success-content p-6 rounded-lg shadow-md">
              <div className="font-bold text-lg">Success</div>
              <div className="text-sm opacity-90 mt-1">Verde andino</div>
              <div className="text-xs opacity-75 mt-2">
                Para estados exitosos
              </div>
            </div>
            <div className="bg-error text-error-content p-6 rounded-lg shadow-md">
              <div className="font-bold text-lg">Error</div>
              <div className="text-sm opacity-90 mt-1">
                Rojo achiote (#B63A1B)
              </div>
              <div className="text-xs opacity-75 mt-2">
                Para errores y alertas
              </div>
            </div>
          </div>
        </Card>

        {/* Badges */}
        <Card
          title="Badges y Etiquetas"
          description="Etiquetas pequeñas para categorías y estados"
        >
          <div className="flex flex-wrap gap-2">
            <div className="badge badge-primary">Primary</div>
            <div className="badge badge-secondary">Secondary</div>
            <div className="badge badge-accent">Accent</div>
            <div className="badge badge-neutral">Neutral</div>
            <div className="badge badge-success">Success</div>
            <div className="badge badge-warning">Warning</div>
            <div className="badge badge-error">Error</div>
            <div className="badge badge-outline badge-primary">Outline</div>
          </div>
        </Card>
      </main>

      <footer className="mt-12 text-center text-base-content/60 text-sm">
        <p>Sistema de Información Salinas Yuyay © 2025</p>
      </footer>
    </div>
  );
}
