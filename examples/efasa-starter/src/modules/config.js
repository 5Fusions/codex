export const defaultCrawlerConfig = {
  region: 'Quebec',
  cadenceMinutes: 60,
  sources: {
    directOwners: {
      enabled: true,
      targets: ['Kijiji', 'LesPAC', 'Craigslist', 'forums/bulletin boards'],
    },
    loginPortals: {
      enabled: true,
      targets: ['DuProprio', 'semi-private portals'],
    },
    humanityAI: {
      enabled: true,
      registries: ['Canada411', 'public property registries'],
    },
  },
  filters: {
    allowBrokerDeals: true,
    highlightSuperDeals: true,
    emailCsvTo: 'agent@example.com',
  },
};
