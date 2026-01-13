import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@utils/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/private/", "/login/"],
    },
    sitemap: `${SEO_CONFIG.root.metadataBase}/sitemap.xml`,
  };
}
