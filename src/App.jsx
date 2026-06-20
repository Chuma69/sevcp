import { useState, useMemo, useEffect } from 'react';
import { STATES, STARTUPS, INTRO_EMAIL } from './data/startups';

const STATE_ORDER = Object.keys(STATES);
const STATE_COUNTS = STATE_ORDER.reduce((acc, s) => {
  acc[s] = STARTUPS.filter(d => d.state === s).length;
  return acc;
}, {});
const MOSAIC_TILES = [...STARTUPS].sort(
  (a, b) => STATE_ORDER.indexOf(a.state) - STATE_ORDER.indexOf(b.state) || a.name.localeCompare(b.name)
);

const LINK_ORDER = ['website', 'x', 'linkedin', 'instagram', 'facebook'];
const LINK_LABEL = { website: 'Website', x: 'X', linkedin: 'LinkedIn', instagram: 'Instagram', facebook: 'Facebook' };

function linkSVG(t) {
  switch (t) {
    case 'website': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>;
    case 'x': return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    case 'linkedin': return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.25 8h4.5v16H.25V8zm7.5 0h4.31v2.19h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V24h-4.5v-7.35c0-1.75-.03-4-2.44-4-2.44 0-2.81 1.91-2.81 3.88V24h-4.5V8z"/></svg>;
    case 'instagram': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>;
    case 'facebook': return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/></svg>;
    default: return null;
  }
}

function introHref(d) {
  const subject = `Intro request — ${d.name} (SEVCP Portfolio)`;
  const body = `Hello SEVCP team,\n\nI'd like to request an introduction to ${d.name}, a ${d.track.toLowerCase()} venture (${d.sector}) based in ${d.state} State, from the SEVCP inaugural portfolio.\n\nA little about me and why I'm reaching out:\n\nThank you,`;
  return `mailto:${INTRO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState('All');
  const [activeStates, setActiveStates] = useState(new Set());
  const [sort, setSort] = useState('az');
  const [selected, setSelected] = useState(null);

  function toggleState(name) {
    setActiveStates(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function clearAll() {
    setQuery(''); setTrack('All'); setActiveStates(new Set()); setSort('az');
  }

  const hasFilters = query || track !== 'All' || activeStates.size > 0;

  const filtered = useMemo(() => {
    let list = STARTUPS.filter(d => {
      if (track !== 'All' && d.track !== track) return false;
      if (activeStates.size && !activeStates.has(d.state)) return false;
      if (query) {
        const hay = (d.name + ' ' + d.sector + ' ' + d.state + ' ' + d.summary + ' ' + (d.description || '')).toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
    if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'state') list = [...list].sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));
    else if (sort === 'track') list = [...list].sort((a, b) => a.track.localeCompare(b.track) || a.name.localeCompare(b.name));
    return list;
  }, [query, track, activeStates, sort]);

  // lock body scroll when panel open
  useEffect(() => {
    document.body.classList.toggle('locked', !!selected);
    return () => document.body.classList.remove('locked');
  }, [selected]);

  // close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* top colour stripe */}
      <div className="stripe"><i/><i/><i/><i/><i/></div>

      {/* nav */}
      <header className="nav">
        <div className="wrap nav-in">
          <div className="brand">
            <img src="/sedc-logo.png" alt="SEDC" />
            <div className="div" />
            <div className="prog">South East Venture<br /><b>Capital Programme</b></div>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">SEVCP PORTFOLIO • 2026</div>
              <h1 className="hero-title">Ventures backed to drive growth across <em>the South East.</em></h1>
              <p className="hero-sub">Selected through a competitive, multi-stage evaluation process, these ventures comprise the inaugural portfolio of the South East Venture Capital Programme, reflecting the Commission's commitment to entrepreneurship, innovation, job creation, and long-term economic growth across the region.</p>
              <div className="statline">
                <div className="s"><div className="n">{STARTUPS.length}</div><div className="l">PORTFOLIO{'\n'}VENTURES</div></div>
                <div className="s"><div className="n">5</div><div className="l">States{'\n'}Represented</div></div>
                <div className="s"><div className="n">{STARTUPS.filter(d => d.track === 'Accelerator').length}</div><div className="l">GROWTH-STAGE{'\n'}VENTURES</div></div>
                <div className="s"><div className="n">{STARTUPS.filter(d => d.track === 'Incubator').length}</div><div className="l">EARLY-STAGE{'\n'}VENTURES</div></div>
              </div>
            </div>
            <div className="mosaic-wrap">
              <div className="mosaic">
                {MOSAIC_TILES.map(d => (
                  <button
                    key={d.name}
                    className="tile"
                    style={{ '--tc': STATES[d.state].color }}
                    data-name={d.name}
                    aria-label={`${d.name} — ${d.state}`}
                    onClick={() => setSelected(d)}
                  />
                ))}
              </div>
              <div className="mosaic-cap">
                {STATE_ORDER.map(name => (
                  <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span className="d" style={{ background: STATES[name].color }} />
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* controls */}
      <div className="controls">
        <div className="wrap">
          <div className="controls-in">
            <label className="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input
                id="q"
                type="text"
                placeholder="Search ventures, sectors, what they build…"
                autoComplete="off"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </label>
            <div className="seg">
              {['All', 'Accelerator', 'Incubator'].map(t => (
                <button
                  key={t}
                  data-track={t}
                  className={track === t ? 'on' : ''}
                  onClick={() => setTrack(t)}
                >
                  {t === 'All' ? 'All Tracks' : t}
                </button>
              ))}
            </div>
            <div className="selwrap">
              <select className="sortsel" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="az">Sort: A–Z</option>
                <option value="state">Sort: By State</option>
                <option value="track">Sort: By Track</option>
              </select>
            </div>
          </div>
          <div className="statefilter">
            <span className="sf-label">States</span>
            {[...STATE_ORDER].sort((a, b) => STATE_COUNTS[b] - STATE_COUNTS[a]).map(name => {
              const on = activeStates.has(name);
              return (
                <button
                  key={name}
                  className={`pill${on ? ' on' : ''}`}
                  style={on ? { background: STATES[name].color } : {}}
                  onClick={() => toggleState(name)}
                >
                  <span className="dot" style={{ background: on ? '#fff' : STATES[name].color }} />
                  {name}
                  <span className="ct">{STATE_COUNTS[name]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="wrap">
        <div className="resbar">
          <div className="count">Showing <b>{filtered.length}</b> of {STARTUPS.length} ventures</div>
          <button className={`clearbtn${hasFilters ? ' show' : ''}`} onClick={clearAll}>Clear filters ✕</button>
        </div>
        <div className="grid">
          {filtered.length === 0 ? (
            <div className="empty">No ventures match your filters.<br />Try clearing them.</div>
          ) : filtered.map(d => {
            const c = STATES[d.state].color;
            const trackClass = d.track === 'Accelerator' ? 'acc' : 'inc';
            return (
              <article
                key={d.name}
                className="card"
                style={{ '--c': c }}
                onClick={() => setSelected(d)}
              >
                <div className="card-top">
                  <span className="state-tag"><span className="dot" />{d.state}</span>
                  <span className={`track-badge ${trackClass}`}>{d.track}</span>
                </div>
                <h3>{d.name}</h3>
                <div className="sector">{d.sector}</div>
                <p className="summ">{d.summary}</p>
                <div className="card-foot">
                  <span className="card-soc">
                    {LINK_ORDER.map(t => {
                      const url = d.links?.[t];
                      return (
                        <a
                          key={t}
                          className="card-soc-a"
                          href={url || '#'}
                          target={url ? '_blank' : undefined}
                          rel={url ? 'noopener noreferrer' : undefined}
                          aria-label={LINK_LABEL[t]}
                          title={LINK_LABEL[t]}
                          onClick={e => { if (!url) e.preventDefault(); e.stopPropagation(); }}
                        >
                          {linkSVG(t)}
                        </a>
                      );
                    })}
                  </span>
                  <span className="arrow">→</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* footer */}
      <footer>
        <div className="wrap">
          <div className="f-stripe">
            {['#6CC5D0','#E85D3D','#C3E84C','#6CC5D0','#2BA84A'].map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
          </div>
          <div className="f-name">South East Venture<br />Capital <span className="lt">Programme</span></div>
          <div className="f-tag">An independent venture programme for South East Nigeria</div>
          <div className="f-support">
            <span className="sup-label">Supported by</span>
            <div className="sup-logos">
              <img src="/sedc-logo.png" alt="South East Development Commission" />
              <span className="sup-div" />
              <span className="sup-wm">Ventures Platform</span>
              <span className="sup-div" />
              <span className="sup-wm">Cascador</span>
            </div>
          </div>
          <div className="f-base">
            <span>© 2026 South East Venture Capital Programme</span>
            <span>Inaugural Portfolio</span>
          </div>
        </div>
      </footer>

      {/* detail overlay */}
      <div className={`overlay${selected ? ' open' : ''}`} onClick={e => { if (e.target.classList.contains('overlay')) setSelected(null); }}>
        <div className="panel">
          {selected && (() => {
            const d = selected;
            const c = STATES[d.state].color;
            return (
              <>
                <div className="panel-band" style={{ background: c }}>
                  <button className="closeb" aria-label="Close" onClick={() => setSelected(null)}>✕</button>
                  <div className="p-track">{d.track} Track</div>
                  <h2>{d.name}</h2>
                  <div className="p-sector">{d.sector}</div>
                </div>
                <div className="panel-body">
                  <div className="p-meta">
                    <div className="mi">
                      <span className="mk">State</span>
                      <span className="mv"><span className="dot" style={{ background: c }} />{d.state}</span>
                    </div>
                    <div className="mi">
                      <span className="mk">Program</span>
                      <span className="mv">{d.track}</span>
                    </div>
                  </div>
                  {d.traction && (
                    <div className="p-traction">
                      <div className="k">Traction</div>
                      <div className="v">{d.traction}</div>
                    </div>
                  )}
                  <p className="p-desc">{d.description}</p>
                  {d.updates?.length > 0 && (
                    <div className="p-updates">
                      <h4>Milestones &amp; Updates</h4>
                      <ul>
                        {d.updates.map((u, i) => (
                          <li key={i}><span className="ud" /><span>{u}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="p-actions">
                    <a className="p-btn primary" href={introHref(d)}>Request an intro →</a>
                  </div>
                  <div className="p-links">
                    <span className="p-links-lbl">Connect</span>
                    {LINK_ORDER.map(t => {
                      const url = d.links?.[t];
                      return (
                        <a
                          key={t}
                          className="p-soc"
                          href={url || '#'}
                          target={url ? '_blank' : undefined}
                          rel={url ? 'noopener noreferrer' : undefined}
                          aria-label={LINK_LABEL[t]}
                          title={LINK_LABEL[t]}
                          onClick={e => { if (!url) e.preventDefault(); }}
                        >
                          {linkSVG(t)}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </>
  );
}
