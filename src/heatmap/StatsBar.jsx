export default function StatsBar({ verified, resolved }) {
    return (
      <div className="hm-stats">
        <span><strong>{verified}</strong> Verified Issues</span>
        <span><strong>{resolved}</strong> Resolved Issues</span>
      </div>
    )
  }