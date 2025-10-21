import Image from "next/image";

export default function Home() {
  return (
    <div className="text-foreground font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl sm:text-5xl text-foreground font-extrabold text-center sm:text-left leading-[1.1]">
          Bienvenido al{" "}
          <span className="text-primary">
            Sistema de Información Salinas Yuyay
          </span>
        </h1>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left text-foreground">
          <li className="mb-2 tracking-[-.01em]">
            Edita{" "}
            <code className="bg-muted text-muted-foreground font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>{" "}
            para comenzar.
          </li>
          <li className="tracking-[-.01em]">
            Los cambios se verán instantáneamente.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-primary transition-colors flex items-center justify-center bg-primary text-primary-foreground gap-2 hover:bg-secondary hover:border-secondary font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="#"
            rel="noopener noreferrer"
          >
            Botón Primario
          </a>
          <a
            className="rounded-full border border-solid border-muted transition-colors flex items-center justify-center bg-background text-foreground hover:bg-muted hover:border-muted font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="#"
            rel="noopener noreferrer"
          >
            Botón Secundario
          </a>
        </div>

        {/* Color test samples */}
        <div className="mt-6 w-full max-w-2xl">
          <h2 className="text-lg font-bold text-foreground mb-3">
            Paleta de Colores:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-md bg-primary text-primary-foreground font-medium text-sm">
              bg-primary / text-primary-foreground
              <div className="text-xs opacity-80 mt-1">Marrón tierra</div>
            </div>
            <div className="p-3 rounded-md bg-secondary text-secondary-foreground font-medium text-sm">
              bg-secondary / text-secondary-foreground
              <div className="text-xs opacity-80 mt-1">Marrón arcilla</div>
            </div>
            <div className="p-3 rounded-md bg-tertiary text-tertiary-foreground font-medium text-sm">
              bg-tertiary / text-tertiary-foreground
              <div className="text-xs opacity-80 mt-1">Ocre salino</div>
            </div>
            <div className="p-3 rounded-md bg-accent text-accent-foreground font-medium text-sm">
              bg-accent / text-accent-foreground
              <div className="text-xs opacity-80 mt-1">Verde andino</div>
            </div>
            <div className="p-3 rounded-md bg-muted text-muted-foreground font-medium text-sm">
              bg-muted / text-muted-foreground
              <div className="text-xs opacity-80 mt-1">Arena</div>
            </div>
            <div className="p-3 rounded-md bg-destructive text-destructive-foreground font-medium text-sm">
              bg-destructive / text-destructive-foreground
              <div className="text-xs opacity-80 mt-1">Rojo achiote</div>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-muted-foreground">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-primary transition-colors"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Aprender
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-primary transition-colors"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentación
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-primary transition-colors"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js →
        </a>
      </footer>
    </div>
  );
}
