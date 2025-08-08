import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eventseats.hannahgoodridge.dev'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/marketing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }

  ]
}
