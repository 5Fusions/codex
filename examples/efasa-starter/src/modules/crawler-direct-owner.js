// Placeholder for crawling multiple direct-owner friendly sources (e.g., Kijiji, LesPAC, Craigslist).
// Replace these stubs with real scraping or API integrations per source.
export async function crawlDirectOwnerSources({ region }) {
  return [
    {
      id: 'direct-kijiji-001',
      title: '3BR bungalow with garage',
      price: '$425,000',
      source: 'Kijiji',
      channel: 'direct-owner',
      region,
    },
    {
      id: 'direct-lespac-002',
      title: 'Condo 2BR, Old Montréal loft style',
      price: '$565,000',
      source: 'LesPAC',
      channel: 'direct-owner',
      region,
    },
    {
      id: 'direct-forum-003',
      title: 'Waterfront lot posted on community board',
      price: '$240,000',
      source: 'Local forum',
      channel: 'direct-owner',
      region,
    },
  ];
}
