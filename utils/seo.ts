import { SALINAS_YUYAY } from "./empresa";
export const SEO_CONFIG = {
  root: {
    metadataBase: "https://salinasyuyay.com",
    title: {
      default: `${SALINAS_YUYAY.nombre} | ${SALINAS_YUYAY.eslogan}`,
      template: `%s | ${SALINAS_YUYAY.nombre} `,
    },
    keywords: [
      "Salinas de Guaranda",
      "Turismo Comunitario",
      "Economía Solidaria",
      "El Salinerito",
      "Quesos",
      "Chocolates",
      "Textiles",
      "Bolívar",
      "Ecuador",
    ],
    openGraph: {
      type: "website",
      locale: "es_EC",
      url: "https://salinasyuyay.com",
      siteName: "Salinas Yuyay",
      images: [
        {
          url: "/vista-superior-salinas.png",
          width: 1200,
          height: 630,
          alt: "Vista Panorámica de Salinas de Guaranda",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SALINAS_YUYAY.nombre}`,
      images: ["/vista-superior-salinas.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  },
  tienda: {
    title: `Tienda | ${SALINAS_YUYAY.nombre} `,
    description: `${SALINAS_YUYAY.tienda.textos.hero.descripcion}`,
    keywords: [
      "Tienda Online Salinas",
      "Comprar Quesos Salinerito",
      "Chocolates Artesanales",
      "Textiles de Alpaca",
      "Productos Orgánicos",
      "Comercio Justo Ecuador",
      "Artesanías Bolívar",
      "Embutidos Artesanales",
    ],
    openGraph: {
      title: `Tienda | ${SALINAS_YUYAY.nombre} `,
      description: `${SALINAS_YUYAY.tienda.textos.hero.descripcion}`,
      images: [
        {
          url: "/productivo/subseccion-tienda.jpeg",
          width: 1200,
          height: 630,
          alt: `Tienda de ${SALINAS_YUYAY.nombre}`,
        },
      ],
    },
  },
};
