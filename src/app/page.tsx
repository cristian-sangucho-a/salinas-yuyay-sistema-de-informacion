export default function Home() {
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

        {/* Paleta de Colores Base */}
        <div className="card bg-base-200 shadow-xl p-6">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Colores Base
          </h2>
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
        </div>

        {/* Colores Temáticos */}
        <div className="card bg-base-200 shadow-xl p-6">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Colores Temáticos
          </h2>
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
        </div>

        {/* Alertas */}
        <div className="card bg-base-200 shadow-xl p-6">
          <h2 className="text-2xl font-bold text-base-content mb-4">Alertas</h2>
          <div className="space-y-3">
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Información importante del sistema</span>
            </div>
            <div className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>¡Operación completada con éxito!</span>
            </div>
            <div className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Advertencia: Revisa esta información</span>
            </div>
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error: Algo salió mal</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="card bg-base-200 shadow-xl p-6">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Badges y Etiquetas
          </h2>
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
        </div>
      </main>

      <footer className="mt-12 text-center text-base-content/60 text-sm">
        <p>Sistema de Información Salinas Yuyay © 2025</p>
      </footer>
    </div>
  );
}
