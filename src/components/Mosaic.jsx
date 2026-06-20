import { STATES, STARTUPS } from '../data/startups';

const stateOrder = Object.keys(STATES);
const sorted = [...STARTUPS].sort(
  (a, b) => stateOrder.indexOf(a.state) - stateOrder.indexOf(b.state) || a.name.localeCompare(b.name)
);

export default function Mosaic({ onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 py-6">
      {sorted.map((d) => (
        <button
          key={d.name}
          onClick={() => onSelect(d)}
          title={`${d.name} — ${d.state}`}
          className="w-8 h-8 rounded-lg transition-all duration-150 hover:scale-125 hover:z-10 relative"
          style={{ background: STATES[d.state].color, opacity: 0.85 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
        />
      ))}
    </div>
  );
}
