import { STATES, INTRO_EMAIL } from '../data/startups';

function introHref(d) {
  const subject = `Intro request — ${d.name} (SEVCP Portfolio)`;
  const body = `Hello SEVCP team,\n\nI'd like to request an introduction to ${d.name}, a ${d.track.toLowerCase()} venture (${d.sector}) based in ${d.state} State, from the SEVCP inaugural portfolio.\n\nA little about me and why I'm reaching out:\n\nThank you,`;
  return `mailto:${INTRO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function DetailPanel({ startup, onClose }) {
  if (!startup) return null;
  const st = STATES[startup.state];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl"
        style={{ background: '#1a3526', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header accent */}
        <div className="h-1.5 rounded-t-3xl sm:rounded-t-2xl" style={{ background: st.color }} />

        <div className="p-6 sm:p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* State + track badges */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: st.color, color: st.ink }}
            >
              {startup.state}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
              {startup.track}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{startup.name}</h2>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>{startup.sector}</p>

          {/* Traction pill */}
          {startup.traction && (
            <div className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(43,168,74,0.15)', color: '#6ee7a0', border: '1px solid rgba(43,168,74,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              {startup.traction}
            </div>
          )}

          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {startup.description}
          </p>

          {/* Updates */}
          {startup.updates?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Recent Updates</p>
              <ul className="space-y-2">
                {startup.updates.map((u, i) => (
                  <li key={i} className="flex gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: st.color }} />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          {startup.links?.website && (
            <div className="mb-6">
              <a href={startup.links.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm hover:underline"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>
                </svg>
                {startup.links.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {/* CTA */}
          <a
            href={introHref(startup)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: st.color, color: st.ink }}
          >
            Request an Introduction
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
