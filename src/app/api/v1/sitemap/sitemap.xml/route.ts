import { NextResponse } from 'next/server';

// Define the base URL - using the same as in layout.tsx
const BASE_URL = 'https://www.tymblhub.com';

export async function GET() {
  try {
    console.log('Generating main sitemap index');

    const currentDate = new Date().toISOString();

    // Generate sitemap index that references all sitemap files
    const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${BASE_URL}/api/v1/sitemap/level1/company-pages_1.xml</loc>
        <lastmod>${currentDate}</lastmod>
    </sitemap>
</sitemapindex>`;

    console.log('Main sitemap index generated successfully');

    // Return XML response with proper headers
    return new NextResponse(sitemapIndexXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating main sitemap index:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
