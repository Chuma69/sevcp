import { useState, useMemo } from 'react';
import { STATES, STARTUPS } from './data/startups';
import StartupCard from './components/StartupCard';
import DetailPanel from './components/DetailPanel';
import Mosaic from './components/Mosaic';

const TRACKS = ['All', 'Accelerator', 'Incubator'];
const STATE_NAMES = Object.keys(STATES);

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

  const filtered = useMemo(() => {
    let list = STARTUPS;
    if (track !== 'All') list = list.filter(d => d.track === track);
    if (activeStates.size > 0) list = list.filter(d => activeStates.has(d.state));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.sector.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q)
      );
    }
    if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === 'state') list = [...list].sort((a, b) => a.state.localeCompare(b.state));
    return list;
  }, [query, track, activeStates, sort]);

  const hasFilters = query || track !== 'All' || activeStates.size > 0 || sort !== 'az';

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <header style={{ position: 'relative', overflow: 'hidden', padding: '64px 24px 40px', textAlign: 'center', background: 'linear-gradient(160deg, #143C2B 0%, #0d2418 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'radial-gradient(circle at 20% 80%, #2BA84A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E85D3D 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
            South-East Venture Capital Programme
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
            SEVCP Cohort One<br />
            <span style={{ color: '#6ee7a0' }}>Portfolio</span>
          </h1>
          <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.55)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            {STARTUPS.filter(d => d.track === 'Accelerator').length} accelerator ventures &amp;{' '}
            {STARTUPS.filter(d => d.track === 'Incubator').length} incubator ventures across five South-East states.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'Ventures', value: STARTUPS.length },
              { label: 'Accelerator', value: STARTUPS.filter(d => d.track === 'Accelerator').length },
              { label: 'Incubator', value: STARTUPS.filter(d => d.track === 'Incubator').length },
              { label: 'States', value: STATE_NAMES.length },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <Mosaic onSelect={setSelected} />

          {/* State legend */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
            {STATE_NAMES.map(name => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: STATES[name].color, display: 'inline-block' }} />
                {name}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Sticky filters */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, padding: '10px 16px', background: 'rgba(13,36,24,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Search + sort */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search ventures, sectors…"
                style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 10, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }}
              />
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: 10, fontSize: 13, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
              <option value="state">By State</option>
            </select>
          </div>

          {/* Track + state pills */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
            {/* Track segmented control */}
            <div style={{ display: 'flex', borderRadius: 20, padding: 2, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {TRACKS.map(t => (
                <button
                  key={t}
                  onClick={() => setTrack(t)}
                  style={{ padding: '4px 12px', borderRadius: 18, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: track === t ? 'rgba(255,255,255,0.12)' : 'transparent', color: track === t ? '#fff' : 'rgba(255,255,255,0.45)' }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />

            {/* State pills */}
            {STATE_NAMES.map(name => {
              const on = activeStates.has(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleState(name)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: `1px solid ${on ? STATES[name].color : 'rgba(255,255,255,0.08)'}`, background: on ? STATES[name].color : 'rgba(255,255,255,0.06)', color: on ? '#fff' : 'rgba(255,255,255,0.55)' }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: on ? '#fff' : STATES[name].color, display: 'inline-block' }} />
                  {name}
                </button>
              );
            })}

            {hasFilters && (
              <button
                onClick={clearAll}
                style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 20, fontSize: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main style={{ padding: '32px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
          {filtered.length} venture{filtered.length !== 1 ? 's' : ''}
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>No ventures match your filters</p>
            <button onClick={clearAll} style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map(d => (
              <StartupCard key={d.name} startup={d} onClick={setSelected} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.18)', fontSize: 12 }}>
        SEVCP Cohort One · South-East Venture Capital Programme
      </footer>

      {selected && <DetailPanel startup={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
