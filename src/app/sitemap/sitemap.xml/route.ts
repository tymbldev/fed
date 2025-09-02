import { NextResponse } from 'next/server';

// Define the base URL for internal API calls
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    console.log('🔥 SITEMAP.XML: Route called!');
    console.log('🔥 Request URL:', request.url);
    console.log('🔥 Pathname:', url.pathname);

    // Call the API for sitemap.xml
    const apiUrl = `${BASE_URL}/api/v1/sitemap/sitemap.xml`;
    console.log('🔥 Calling API:', apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`❌ API call failed with status: ${response.status}`);
      return new NextResponse('Failed to fetch sitemap', { status: response.status });
    }

    // Get the XML content from the API
    const xmlContent = await response.text();

    console.log('✅ Successfully fetched sitemap from API');
    console.log('✅ Response length:', xmlContent.length);
    console.log('✅ Response preview:', xmlContent.substring(0, 100) + '...');

    // Return the XML content with proper headers
    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('❌ Error in sitemap.xml route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
