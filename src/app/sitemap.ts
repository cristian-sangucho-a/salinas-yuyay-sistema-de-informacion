import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@utils/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/tienda",
    "/cultural",
    "/turismo",
    "/productos",
    "/categorias",
    "/contacto",
  ].map((route) => ({
    url: `${SEO_CONFIG.root.metadataBase}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
