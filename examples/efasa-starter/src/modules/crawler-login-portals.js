// Placeholder for crawling login-walled portals (e.g., DuProprio, semi-private marketplaces).
// Swap with authenticated scraping flows or partner APIs as you integrate real sources.
export async function crawlLoginPortals({ region }) {
  return [
    {
      id: 'login-duproprio-101',
      title: 'Owner-listed triplex (authenticated portal)',
      price: '$799,000',
      source: 'DuProprio',
      channel: 'login-portal',
      region,
    },
    {
      id: 'login-private-102',
      title: 'Semi-private estate sale, quick close',
      price: '$655,000',
      source: 'Semi-private portal',
      channel: 'login-portal',
      region,
    },
  ];
}
