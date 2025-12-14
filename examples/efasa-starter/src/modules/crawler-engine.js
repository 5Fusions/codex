// Lightweight simulated multi-source crawler so the UI can show flows before wiring a real backend.
// Replace the mock logic with actual scraping / API calls when ready.
import { crawlDirectOwnerSources } from './crawler-direct-owner';
import { crawlLoginPortals } from './crawler-login-portals';
import { crawlHumanityAI } from './crawler-humanity-ai';
import { applyFilters } from './filters';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runCrawler({ region, cadenceMinutes, sources, filters }) {
  await sleep(300); // small wait for realism

  const aggregated = [];
  const warnings = [];

  const executionPlan = [
    {
      enabled: sources?.directOwners?.enabled,
      runner: () => crawlDirectOwnerSources({ region }),
      label: 'direct-owner sources',
    },
    {
      enabled: sources?.loginPortals?.enabled,
      runner: () => crawlLoginPortals({ region }),
      label: 'login portals',
    },
    {
      enabled: sources?.humanityAI?.enabled,
      runner: () => crawlHumanityAI({ region }),
      label: 'humanity AI',
    },
  ];

  const active = executionPlan.filter((item) => item.enabled);
  if (!active.length) {
    throw new Error('No sources enabled — turn on at least one target to crawl.');
  }

  for (const step of active) {
    try {
      const rows = await step.runner();
      aggregated.push(...rows);
    } catch (err) {
      warnings.push(`${step.label} failed: ${err.message}`);
    }
  }

  if (!aggregated.length) {
    const message = warnings.length ? warnings.join(' | ') : 'No results found from enabled sources.';
    throw new Error(message);
  }

  const enriched = aggregated.map((item) => ({
    ...item,
    cadenceMinutes,
    retrievedAt: new Date().toISOString(),
  }));

  const filtered = applyFilters(enriched, filters || {});

  // If some modules errored, surface a soft warning while still returning data
  if (warnings.length) {
    console.warn('Crawler warnings:', warnings.join(' | '));
  }

  await sleep(200);
  return filtered;
}
