export default function LegendBar() {
    return (
      <div className="hm-legend">
        <span><b className="hm-dot hm-teal" /> Teal = High Risk Zone</span>
        <div className="hm-gradient" aria-hidden="true" />
        <span><b className="hm-dot hm-purple" /> Purple = Lower Risk Zone</span>
      </div>
    )
  }