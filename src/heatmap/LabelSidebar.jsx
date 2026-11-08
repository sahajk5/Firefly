import { LABELS } from './labels'

export default function LabelSidebar({ active, onSelect, onShowAll }) {
  return (
    <aside className="hm-sidebar">
      {LABELS.map((l) => (
        <button
          key={l.id}
          type="button"
          className={`hm-label ${active === l.id ? 'is-active' : ''}`}
          onClick={() => onSelect(l.id)}
          aria-pressed={active === l.id}
        >
          <span className="hm-circle">{l.icon}</span>
          <span className="hm-label-name">{l.name}</span>
        </button>
      ))}
      <button type="button" className="hm-showall" onClick={onShowAll} disabled={!active}>
        Show all
      </button>
    </aside>
  )
}