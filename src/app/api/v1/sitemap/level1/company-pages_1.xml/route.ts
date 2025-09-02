import { NextResponse } from 'next/server';
import { buildCompanySeoPath } from '../../../../../utils/seo';

// Define the base URL
const BASE_URL = 'https://www.tymblhub.com';

// Interface for company data
interface Company {
  id: number;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Function to fetch companies data for level 1 (first batch)
async function fetchLevel1Companies(): Promise<Company[]> {
  try {
    // First batch of companies (IDs 1001-1050)
    const companies: Company[] = [
      { id: 1001, name: "Amara Raja Group" },
      { id: 1002, name: "Kinara Capital" },
      { id: 1003, name: "Allianz Technology" },
      { id: 1004, name: "Visionet Systems" },
      { id: 1005, name: "eClinicalWorks" },
      { id: 1006, name: "Technip" },
      { id: 1007, name: "Petrofac" },
      { id: 1008, name: "ValueMomentum" },
      { id: 1009, name: "Aircel" },
      { id: 1010, name: "Secure Meters" },
      { id: 1011, name: "Nilkamal" },
      { id: 1012, name: "Birlanu" },
      { id: 1013, name: "Colgate Palmolive" },
      { id: 1014, name: "Fractal Analytics" },
      { id: 1015, name: "VeeTechnologies" },
      { id: 1016, name: "ICON plc" },
      { id: 1017, name: "Mastek" },
      { id: 1018, name: "Wheels" },
      { id: 1019, name: "NetCracker Technology" },
      { id: 1020, name: "AstraZeneca" },
      { id: 1021, name: "Perfetti Van Melle" },
      { id: 1022, name: "Nasser S. Al-Hajri Corporation" },
      { id: 1023, name: "Tikona Infinet" },
      { id: 1024, name: "Pristyn Care" },
      { id: 1025, name: "Vistaar Finance" },
      { id: 1026, name: "Vertiv" },
      { id: 1027, name: "Kendriya Vidyalaya Sangathan" },
      { id: 1028, name: "Incheon Motors" },
      { id: 1029, name: "NxtWave" },
      { id: 1030, name: "Thomas Cook" },
      { id: 1031, name: "Softenger" },
      { id: 1032, name: "Barclays Global Service Centre" },
      { id: 1033, name: "Pizza Hut" },
      { id: 1034, name: "Cure.fit" },
      { id: 1035, name: "Westside" },
      { id: 1036, name: "Jubilant Pharmova" },
      { id: 1037, name: "Gannon Dunkerley" },
      { id: 1038, name: "Lemon Tree Hotels" },
      { id: 1039, name: "Greenko Group" },
      { id: 1040, name: "Lowe's" },
      { id: 1041, name: "Knorr-Bremse" },
      { id: 1042, name: "TÜV NORD" },
      { id: 1043, name: "Asirvad Microfinance" },
      { id: 1044, name: "C&S Electric" },
      { id: 1045, name: "Balkrishna Industries" },
      { id: 1046, name: "VIP Industries" },
      { id: 1047, name: "Lakshmi Machine Works" },
      { id: 1048, name: "Gharda Chemicals" },
      { id: 1049, name: "Comviva Technology" },
      { id: 1050, name: "Pricol" },
    ];

    return companies;
  } catch (error) {
    console.error('Error fetching level 1 companies:', error);
    return [];
  }
}

// Function to escape XML characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Generate XML sitemap content for company pages
function generateCompanyPagesXML(companies: Company[]): string {
  const currentDate = new Date().toISOString();

  const companyUrlEntries = companies.map(company => {
    const seoPath = buildCompanySeoPath({ name: company.name, id: company.id });
    const fullUrl = `${BASE_URL}${seoPath}`;

    // Escape the URL to ensure valid XML
    const escapedUrl = escapeXml(fullUrl);

    return `    <url>
        <loc>${escapedUrl}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${companyUrlEntries}
</urlset>`;
}

export async function GET() {
  try {
    console.log('Generating sitemap for level1/company-pages_1.xml');

    // Fetch companies data for level 1
    const companies = await fetchLevel1Companies();

    console.log(`Found ${companies.length} companies for level 1`);

    // Generate sitemap XML
    const sitemapXML = generateCompanyPagesXML(companies);

    console.log('Sitemap XML generated successfully');

    // Return XML response with proper headers
    return new NextResponse(sitemapXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating level1/company-pages_1.xml sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
