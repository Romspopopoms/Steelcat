import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://steel-cat.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/paiement', '/checkout', '/confirmation'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
