// Lightweight filtering/highlighting stub.
export function applyFilters(listings, { allowBrokerDeals, highlightSuperDeals }) {
  const filtered = allowBrokerDeals
    ? listings
    : listings.filter((item) => item.channel !== 'brokerage');

  if (!highlightSuperDeals) return filtered;

  return filtered.map((item) => {
    const isStandout =
      item.channel === 'humanity-ai' || item.price.toLowerCase().includes('contact') || item.price.includes('$240');
    return {
      ...item,
      flags: [...(item.flags || []), ...(isStandout ? ['super-deal'] : [])],
    };
  });
}
