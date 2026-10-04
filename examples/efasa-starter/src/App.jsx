import React, { useMemo, useState } from 'react';
import { logInteraction } from './modules/learning-core';
import { draftAdCopy } from './modules/marketing-tools';
import { runCrawler } from './modules/crawler-engine';
import { defaultCrawlerConfig } from './modules/config';

const checklist = [
  'Autonomous search agent scanning Quebec listings (direct-owner, public classifieds, login portals)',
  'Command-only co-pilot: runs tasks after you click or approve',
  'Marketing aide: ad copy, outreach drafts, and quick replies',
  'Learning core: improves from your interactions with consented logs',
  'Transparent data ownership: interaction logs stay with you',
];

function App() {
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const { sources, filters } = defaultCrawlerConfig;

  const status = useMemo(() => {
    if (busy) return 'Scanning…';
    if (error) return 'Needs attention';
    if (results.length) return `Last pull: ${new Date(results[0].retrievedAt).toLocaleTimeString()}`;
    return 'Idle';
  }, [busy, error, results]);

  const handleStart = async () => {
    setBusy(true);
    setError('');
    logInteraction({ event: 'start-crawler-clicked', timestamp: new Date().toISOString() });
    try {
      const data = await runCrawler(defaultCrawlerConfig);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Crawler failed');
      setResults([]);
    } finally {
      setBusy(false);
    }
  };

  const handleAdCopy = () => {
    const draft = draftAdCopy({ headline: '2BR condo in Montréal', tone: 'energetic' });
    alert(draft);
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">E-State Fusions AI Search Agent</p>
          <h1>Hi, I’m Efasa 👋</h1>
          <p className="lede">
            Your ethical, command-only real estate co-pilot. She scans Quebec listings, learns from how you use her, and keeps
            interaction logs under your control.
          </p>
          <div className="status">
            <span className={`pill ${busy ? 'pill-busy' : error ? 'pill-warn' : 'pill-idle'}`}>{status}</span>
            <span className="hint">Command-only mode — Efasa only runs after you click.</span>
          </div>
          <div className="actions">
            <button className="primary" onClick={handleStart} disabled={busy}>
              {busy ? 'Scanning…' : 'Start crawler'}
            </button>
            <button className="ghost" onClick={handleAdCopy} disabled={busy}>
              Generate ad copy
            </button>
          </div>
          <p className="consent">
            By using Efasa you consent to anonymous interaction logging for model improvement. No personal client data is collected
            unless you enter it explicitly.
          </p>
        </div>
        <div className="card">
          <h2>Efasa’s promises</h2>
          <ul>
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </header>

      <section className="panels">
        <div className="panel">
          <h3>Agent controls</h3>
          <p>Configure regions, cadence, and filters. Efasa remains approval-gated before any crawl or export.</p>
          <div className="tags">
            <span className="tag">Region: {defaultCrawlerConfig.region}</span>
            <span className="tag">Cadence: {defaultCrawlerConfig.cadenceMinutes} min</span>
            <span className="tag">Direct-owner sources: {sources.directOwners.targets.join(', ')}</span>
            <span className="tag">Login portals: {sources.loginPortals.enabled ? 'On' : 'Off'}</span>
            <span className="tag">Humanity AI: {sources.humanityAI.enabled ? sources.humanityAI.registries.join(', ') : 'Off'}</span>
            <span className="tag">Filters: {filters.highlightSuperDeals ? 'Highlight super deals' : 'No highlights'}</span>
          </div>
        </div>
        <div className="panel">
          <h3>Latest crawl</h3>
          {busy && <p className="muted">Working…</p>}
          {error && <p className="error">{error}</p>}
          {!busy && !error && !results.length && <p className="muted">No results yet. Kick off a crawl.</p>}
          {!busy && !error && results.length > 0 && (
            <ul className="result-list">
              {results.map((row) => (
                <li key={row.id}>
                  <div className="result-title">{row.title}</div>
                  <div className="result-meta">{row.price}</div>
                  <div className="result-sub">{row.source} • {row.channel} • {row.region}</div>
                  {row.flags?.length ? <div className="result-flags">{row.flags.join(', ')}</div> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel">
          <h3>Marketing toolkit</h3>
          <p>Ad writer, email drafts, and social posts live here. Hook this panel to your CRM when you’re ready.</p>
          <button className="ghost small" onClick={handleAdCopy} disabled={busy}>
            Draft sample ad
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
