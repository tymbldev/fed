import { NextResponse } from 'next/server';

// Define the base URL for internal API calls
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const url = new URL(request.url);

    console.log('🔥 DYNAMIC SITEMAP: Route called!');
    console.log('🔥 Request URL:', request.url);
    console.log('🔥 Path segments:', path);
    console.log('🔥 Full pathname:', url.pathname);

    // Extract the path after /sitemap/
    const sitemapPath = path.join('/');
    console.log('🔥 Sitemap path:', sitemapPath);

    // Add a special response for testing console logs
    if (sitemapPath === 'test-console-logs.xml') {
      console.log('🎯 TEST ROUTE CALLED - This should appear in your server terminal!');
      return new NextResponse(`<!-- Console test successful! Check your server terminal for logs -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.tymblhub.com/test</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
</urlset>`, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    }

    // Construct the API URL by mapping /sitemap/* to /api/v1/sitemap/*
    const apiPath = `/api/v1/sitemap/${sitemapPath}`;
    const apiUrl = `${BASE_URL}${apiPath}`;

    console.log('🔥 Calling API:', apiUrl);

    // Call the corresponding API endpoint
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`❌ API call failed with status: ${response.status}`);
      console.error(`❌ API URL: ${apiUrl}`);
      return new NextResponse(`Failed to fetch sitemap from ${apiPath}`, {
        status: response.status
      });
    }

    // Get the XML content from the API
    const xmlContent = await response.text();

    console.log('✅ Successfully fetched sitemap from API');
    console.log('✅ Response length:', xmlContent.length);
    console.log('✅ Response preview:', xmlContent.substring(0, 200) + '...');

    // Return the XML content with proper headers
    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('❌ Error in dynamic sitemap route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Export other HTTP methods if needed
export async function HEAD(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // Handle HEAD requests the same way as GET but without body
  const getResponse = await GET(request, { params });
  return new NextResponse(null, {
    status: getResponse.status,
    headers: getResponse.headers,
  });
}
