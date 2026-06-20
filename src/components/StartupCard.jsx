import { STATES } from '../data/startups';

export default function StartupCard({ startup, onClick }) {
  const st = STATES[startup.state];

  return (
    <button
      onClick={() => onClick(startup)}
      className="text-left w-full rounded-2xl p-5 transition-all duration-200 cursor-pointer group"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: st.color, color: st.ink }}
          >
            {startup.state}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}>
            {startup.track}
          </span>
        </div>
        {startup.traction && (
          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 mt-1" title={startup.traction} />
        )}
      </div>

      {/* Name */}
      <h3 className="text-base font-semibold text-white mb-1 leading-snug">{startup.name}</h3>

      {/* Sector */}
      <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>{startup.sector}</p>

      {/* Summary */}
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{startup.summary}</p>
    </button>
  );
}
