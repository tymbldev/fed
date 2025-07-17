import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for industries with companies
  const industries = [
    {
      industryId: 1,
      industryName: "Technology",
      industryDescription: "Software, hardware, and digital services",
      companyCount: 15,
      topCompanies: [
        {
          companyId: 1,
          companyName: "Google",
          logoUrl: "https://logo.clearbit.com/google.com",
          website: "https://www.google.com",
          headquarters: "Mountain View, CA",
          activeJobCount: 1250
        },
        {
          companyId: 2,
          companyName: "Microsoft",
          logoUrl: "https://logo.clearbit.com/microsoft.com",
          website: "https://www.microsoft.com",
          headquarters: "Redmond, WA",
          activeJobCount: 980
        },
        {
          companyId: 3,
          companyName: "Apple",
          logoUrl: "https://logo.clearbit.com/apple.com",
          website: "https://www.apple.com",
          headquarters: "Cupertino, CA",
          activeJobCount: 750
        }
      ]
    },
    {
      industryId: 2,
      industryName: "E-commerce",
      industryDescription: "Online retail and marketplace platforms",
      companyCount: 8,
      topCompanies: [
        {
          companyId: 4,
          companyName: "Amazon",
          logoUrl: "https://logo.clearbit.com/amazon.com",
          website: "https://www.amazon.com",
          headquarters: "Seattle, WA",
          activeJobCount: 2100
        },
        {
          companyId: 15,
          companyName: "Target",
          logoUrl: "https://logo.clearbit.com/target.com",
          website: "https://www.target.com",
          headquarters: "Minneapolis, MN",
          activeJobCount: 450
        }
      ]
    },
    {
      industryId: 3,
      industryName: "Automotive",
      industryDescription: "Electric vehicles and automotive technology",
      companyCount: 3,
      topCompanies: [
        {
          companyId: 5,
          companyName: "Tesla",
          logoUrl: "https://logo.clearbit.com/tesla.com",
          website: "https://www.tesla.com",
          headquarters: "Austin, TX",
          activeJobCount: 320
        }
      ]
    },
    {
      industryId: 4,
      industryName: "Entertainment",
      industryDescription: "Media, streaming, and entertainment services",
      companyCount: 6,
      topCompanies: [
        {
          companyId: 6,
          companyName: "Spotify",
          logoUrl: "https://logo.clearbit.com/spotify.com",
          website: "https://www.spotify.com",
          headquarters: "Stockholm, Sweden",
          activeJobCount: 280
        },
        {
          companyId: 7,
          companyName: "Disney",
          logoUrl: "https://logo.clearbit.com/disney.com",
          website: "https://www.disney.com",
          headquarters: "Burbank, CA",
          activeJobCount: 420
        }
      ]
    },
    {
      industryId: 5,
      industryName: "Financial Services",
      industryDescription: "Banking, investment, and financial technology",
      companyCount: 12,
      topCompanies: [
        {
          companyId: 20,
          companyName: "Goldman Sachs",
          logoUrl: "https://logo.clearbit.com/gs.com",
          website: "https://www.goldmansachs.com",
          headquarters: "New York, NY",
          activeJobCount: 650
        },
        {
          companyId: 21,
          companyName: "Morgan Stanley",
          logoUrl: "https://logo.clearbit.com/morganstanley.com",
          website: "https://www.morganstanley.com",
          headquarters: "New York, NY",
          activeJobCount: 580
        }
      ]
    },
    {
      industryId: 6,
      industryName: "Software & SaaS",
      industryDescription: "Software-as-a-Service and enterprise software",
      companyCount: 10,
      topCompanies: [
        {
          companyId: 23,
          companyName: "Adobe",
          logoUrl: "https://logo.clearbit.com/adobe.com",
          website: "https://www.adobe.com",
          headquarters: "San Jose, CA",
          activeJobCount: 380
        },
        {
          companyId: 24,
          companyName: "Salesforce",
          logoUrl: "https://logo.clearbit.com/salesforce.com",
          website: "https://www.salesforce.com",
          headquarters: "San Francisco, CA",
          activeJobCount: 520
        }
      ]
    }
  ];

  return NextResponse.json(industries);
}