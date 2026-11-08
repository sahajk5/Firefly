import { useEffect, useMemo, useState } from 'react'
import { getLabel } from './labels'
import { distanceMeters } from './geo'
import { NEARBY_METERS, riskLevel, summarize } from './risk'
import { CURRENT_USER_ID, FRIENDS } from './config'
import { reverseGeocode } from './geocode'

function displayAuthor(r) {
  if (r.authorId === CURRENT_USER_ID) return 'You'
  if (r.visibleToFriends && FRIENDS[r.authorId]) return FRIENDS[r.authorId]
  return 'Anonymous'
}

const LEVEL_TEXT = { high: 'High risk', medium: 'Medium risk', low: 'Lower risk' }

export default function ReportPanel({ location, reports, onClose, onEdit, onToggleResolved }) {
  const [address, setAddress] = useState('')

  const { lat, lng, name } = location
  useEffect(() => {
    if (name) return
    let cancelled = false
    reverseGeocode({ lat, lng })
      .then((a) => {
        if (!cancelled) setAddress(a)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [lat, lng, name])

  const nearby = useMemo(
    () =>
      reports
        .filter((r) => distanceMeters(location, r) <= NEARBY_METERS)
        .sort((a, b) => new Date(b.incidentAt) - new Date(a.incidentAt)),
    [reports, location]
  )

  const score = nearby.reduce((sum, r) => sum + r.weight, 0)
  const level = riskLevel(score)
  const labelIds = [...new Set(nearby.map((r) => r.label))]
  const { recent, verified } = summarize(nearby)

  return (
    <div className="hm-panel">
      <button type="button" className="hm-close" onClick={onClose} aria-label="Close">×</button>
      <h2>{location.name || address || 'Selected location'}</h2>

      {nearby.length === 0 ? (
        <p className="hm-summary">No reports here yet.</p>
      ) : (
        <>
          <span className={`hm-badge hm-${level}`}>{LEVEL_TEXT[level]}</span>
          <div className="hm-chips">
            {labelIds.map((id) => (
              <span key={id} className="hm-chip">{getLabel(id).icon} {getLabel(id).name}</span>
            ))}
          </div>
          <p className="hm-summary">{recent} reports in the last 6 months, {verified} verified</p>

          <ul className="hm-reports">
            {nearby.map((r) => {
              const mine = r.authorId === CURRENT_USER_ID
              return (
                <li key={r.id} className={mine ? 'hm-mine' : ''}>
                  <div className="hm-report-head">
                    <strong>{getLabel(r.label).icon} {getLabel(r.label).name}</strong>
                    <span>
                      {mine && <span className="hm-tag">Your report</span>}
                      <span className={`hm-status hm-status-${r.status}`}>{r.status}</span>
                    </span>
                  </div>
                  <p>{r.description}</p>
                  <small>
                    {new Date(r.incidentAt).toLocaleString()} · {displayAuthor(r)}
                  </small>
                  {mine && (
                    <div className="hm-actions">
                      <button type="button" onClick={() => onEdit(r)}>Edit</button>
                      <button type="button" onClick={() => onToggleResolved(r)}>
                        {r.resolved ? 'Reopen' : 'Mark resolved'}
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}