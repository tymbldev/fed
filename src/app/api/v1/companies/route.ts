import { NextResponse } from 'next/server';

export async function GET() {
  const companies = [
    {
        "id": 1,
        "name": "Google",
        "description": "A multinational technology company that specializes in Internet-related services and products.",
        "website": "https://www.google.com",
        "logoUrl": "https://logo.clearbit.com/google.com",
        "createdAt": null,
        "updatedAt": null
    },
    {
        "id": 2,
        "name": "Amazon",
        "description": "An American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
        "website": "https://www.amazon.com",
        "logoUrl": "https://logo.clearbit.com/amazon.com",
        "createdAt": null,
        "updatedAt": null
    },
    {
        "id": 3,
        "name": "Apple",
        "logoUrl": "https://logo.clearbit.com/apple.com",
    },
    {
        "id": 4,
        "name": "Tesla",
        "logoUrl": "https://logo.clearbit.com/tesla.com",
    },
    {
        "id": 5,
        "name": "Microsoft",
        "logoUrl": "https://logo.clearbit.com/microsoft.com",
    },
    {
        "id": 6,
        "name": "Spotify",
        "logoUrl": "https://logo.clearbit.com/spotify.com",
    },
    {
        "id": 7,
        "name": "Disney",
        "logoUrl": "https://logo.clearbit.com/disney.com",
    },
    {
        "id": 8,
        "name": "Comcast",
        "logoUrl": "https://logo.clearbit.com/comcast.com",
    },
    {
        "id": 9,
        "name": "Chewy",
        "logoUrl": "https://logo.clearbit.com/chewy.com",
    },
    {
        "id": 10,
        "name": "IBM",
        "logoUrl": "https://logo.clearbit.com/ibm.com",
    },
    {
        "id": 11,
        "name": "Intel",
        "logoUrl": "https://logo.clearbit.com/intel.com",
    },
    {
        "id": 12,
        "name": "Boeing",
        "logoUrl": "https://logo.clearbit.com/boeing.com",
    },
    {
        "id": 13,
        "name": "Starbucks",
        "logoUrl": "https://logo.clearbit.com/starbucks.com",
    },
    {
        "id": 14,
        "name": "Pinterest",
        "logoUrl": "https://logo.clearbit.com/pinterest.com",
    },
    {
        "id": 15,
        "name": "Target",
        "logoUrl": "https://logo.clearbit.com/target.com",
    },
    {
        "id": 16,
        "name": "Atlassian",
        "logoUrl": "https://logo.clearbit.com/atlassian.com",
    },
    {
        "id": 17,
        "name": "Upwork",
        "logoUrl": "https://logo.clearbit.com/upwork.com",
    },
    {
        "id": 18,
        "name": "Splunk",
        "logoUrl": "https://logo.clearbit.com/splunk.com",
    },
    {
        "id": 19,
        "name": "Dropbox",
        "logoUrl": "https://logo.clearbit.com/dropbox.com",
    },
    {
        "id": 20,
        "name": "Goldman Sachs",
        "logoUrl": "https://logo.clearbit.com/gs.com",
    },
    {
        "id": 21,
        "name": "Morgan Stanley",
        "logoUrl": "https://logo.clearbit.com/morganstanley.com",
    },
    {
        "id": 22,
        "name": "Wells Fargo",
        "logoUrl": "https://logo.clearbit.com/wellsfargo.com",
    },
    {
        "id": 23,
        "name": "Adobe",
        "logoUrl": "https://logo.clearbit.com/adobe.com",
    },
    {
        "id": 24,
        "name": "Salesforce",
        "logoUrl": "https://logo.clearbit.com/salesforce.com",
    }
  ];
  return NextResponse.json(companies);
}