export const SALINAS_YUYAY = {
  nombre: "Salinas Yuyay",

  descripcion: `Un ecosistema integrado de desarrollo comunitario, cultura viva y turismo sostenible en el corazón de los Andes.`,
  eslogan: "Preservando nuestra historia para el futuro.",
  logo: "/logo.png",
  email: "",
  telefono: "",
  redesSociales: {
    facebook: "https://facebook.com/example",
    twitter: "https://twitter.com/example",
    instagram: "https://instagram.com/example",
    linkedin: "https://linkedin.com/company/example",
  },

  tienda: {
    textos: {
      hero: {
        titulo: "Descubre la autenticidad",
        tituloDestacado: "En cada producto",
        descripcion:
          "Productos artesanales elaborados con técnicas ancestrales y materias primas de la más alta calidad. Cada pieza cuenta una historia de nuestra comunidad.",
      },
      categorias: {
        titulo: "Categorías de productos andinos",
      },
      productosDestacados: {
        titulo: "Productos destacados",
      },
    },
    features: [
      {
        titulo: "Envío gratis",
        descripcion: "En compras mayores a $50",
        icon: "FaTruck",
        variant: "primary" as const,
      },
      {
        titulo: "100% Natural",
        descripcion: "Productos artesanales genuinos",
        icon: "FaShieldAlt",
        variant: "secondary" as const,
      },
      {
        titulo: "Soporte rápido",
        descripcion: "Atención personalizada",
        icon: "FaHeadset",
        variant: "accent" as const,
      },
      {
        titulo: "Pago seguro",
        descripcion: "Múltiples métodos de pago",
        icon: "FaCreditCard",
        variant: "neutral" as const,
      },
    ],
  },
  landing: {
    hero: {
      title: "Salinas Yuyay",
      subtitle:
        "Un ecosistema integrado de desarrollo comunitario, cultura viva y turismo sostenible en el corazón de los Andes.",
      portals: [
        {
          id: "productivo",
          title: "TIENDA",
          description:
            "Descubre el sabor de nuestra tierra. Quesos, chocolates y textiles de calidad exportación.",
          icon: "FaShoppingBag",
          bgImage: "from-secondary/80 to-secondary/40",
          colorClass: "bg-secondary",
        },
        {
          id: "cultural",
          title: "ARCHIVO",
          description:
            "Memoria viva de un pueblo. Explora nuestro archivo histórico y fotográfico.",
          icon: "FaLandmark",
          bgImage: "from-primary/80 to-primary/40",
          colorClass: "bg-primary",
        },
        {
          id: "turismo",
          title: "TURISMO",
          description:
            "Vive la experiencia Salinas. Rutas, museos y paisajes inolvidables.",
          icon: "FaMapMarkedAlt",
          bgImage: "from-neutral/80 to-neutral/40",
          colorClass: "bg-neutral",
        },
      ],
    },
    statsTicker: [
      { icon: "FaLeaf", text: "Productos 100% orgánicos" },
      { icon: "FaHistory", text: "50+ Años de historia" },
      { icon: "FaTicketAlt", text: "Turismo comunitario" },
      { icon: "FaShoppingBag", text: "Envíos a todo el país" },
    ],
    dynamicContent: {
      productivo: {
        title: "Tienda El salinerito",
        subtitle: "Calidad y tradición",
        description:
          "Nuestros productos son el resultado de décadas de trabajo comunitario y perfeccionamiento artesanal. Desde los famosos quesos hasta los chocolates de aroma fino.",
        features: [
          {
            icon: "FaShoppingBag",
            title: "Quesos maduros",
            text: "Variedade andinas",
          },
          { icon: "FaLeaf", title: "Chocolates", text: "Cacao fino de aroma" },
          {
            icon: "FaTicketAlt",
            title: "Textiles",
            text: "Lana de alpaca y oveja",
          },
        ],
        cta: "Ir a la tienda",
        link: "/tienda",
        color: "text-secondary",
        bg: "bg-secondary/10",
      },
      cultural: {
        title: "Archivo histórico",
        subtitle: "Memoria viva",
        description:
          "Explora miles de documentos, fotografías y testimonios que narran la transformación de Salinas de Guaranda. Un legado para las futuras generaciones.",
        features: [
          {
            icon: "FaHistory",
            title: "Documentos",
            text: "Actas y registros históricos",
          },
          {
            icon: "FaUser",
            title: "Fotografías",
            text: "Imágenes de la época",
          },
          { icon: "FaLandmark", title: "Relatos", text: "Historias de vida" },
        ],
        cta: "Explorar Archivo",
        link: "/cultural",
        color: "text-primary",
        bg: "bg-primary/10",
      },
      turismo: {
        title: "Visita Salinas",
        subtitle: "Experiencias Únicas",
        description:
          "Ven y conoce de cerca nuestras fábricas, minas de sal y paisajes impresionantes. Organiza tu visita y vive el turismo comunitario.",
        features: [
          {
            icon: "FaMapMarkedAlt",
            title: "Rutas",
            text: "Senderos y miradores",
          },
          {
            icon: "FaTicketAlt",
            title: "Fábricas",
            text: "Proceso productivo",
          },
          {
            icon: "FaGlobeAmericas",
            title: "Hospedaje",
            text: "Hoteles comunitarios",
          },
        ],
        cta: "Planificar Visita",
        link: "/turismo",
        color: "text-neutral",
        bg: "bg-neutral/10",
      },
    },
    impact: {
      title: "Nuestro Impacto Comunitario",
      stats: [
        { value: "50+", label: "Años de historia" },
        { value: "120+", label: "Familias productoras" },
        { value: "300+", label: "Productos únicos" },
        { value: "10k+", label: "Visitas anuales" },
      ],
    },
    faq: {
      subtitle: "Dudas comunes",
      title: "Preguntas frecuentes",
      items: [
        {
          q: "¿Cómo puedo comprar productos desde otra ciudad?",
          a: "Realizamos envíos seguros a todo el Ecuador a través de nuestra tienda en línea. El tiempo de entrega es de 24 a 48 horas.",
        },
        {
          q: "¿Es necesario reservar para visitar las minas de sal?",
          a: "Sí, recomendamos reservar con anticipación, especialmente en feriados, para garantizar disponibilidad de guías comunitarios.",
        },
        {
          q: "¿Qué horarios de atención tiene el museo?",
          a: "El museo y el centro de interpretación atienden de Miércoles a Domingo, de 09:00 a 17:00.",
        },
        {
          q: "¿Aceptan pagos con tarjeta de crédito?",
          a: "Sí, tanto en nuestra tienda física como en línea aceptamos todas las tarjetas de crédito y débito.",
        },
      ],
    },
    contact: {
      subtitle: "Contáctanos",
      title: "Estamos aquí para ayudarte",
      description:
        "¿Tienes dudas sobre tu pedido o quieres organizar una visita grupal? Escríbenos.",
      location: {
        title: "Ubicación Principal",
        address: "Salinas de Guaranda, Provincia de Bolívar, Ecuador.",
      },
      email: { title: "Correo Electrónico", address: "info@salinasyuyay.com" },
      phone: { title: "Teléfono / WhatsApp", number: "+593 99 123 4567" },
      mapButton: "Ver en Google Maps",
    },
  },
};
