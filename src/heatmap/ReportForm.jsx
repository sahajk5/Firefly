import { useState } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { LABELS } from './labels'
import SearchBox from './SearchBox'

const toLocalInput = (d) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

export default function ReportForm({ editing, location, onLocationChange, onSubmit, onDelete, onCancel }) {
  const { current: map } = useMap()
  const [label, setLabel] = useState(editing?.label ?? '')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [incidentAt, setIncidentAt] = useState(() =>
    toLocalInput(editing ? new Date(editing.incidentAt) : new Date())
  )
  const [visibleToFriends, setVisibleToFriends] = useState(editing?.visibleToFriends ?? true)
  const [resolved, setResolved] = useState(editing?.resolved ?? false)
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)

  function locateMe() {
    if (!navigator.geolocation) {
      setError('Your browser does not support location. Search an address or click the map instead.')
      return
    }
    setError('')
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        onLocationChange(loc)
        map?.flyTo({ center: [loc.lng, loc.lat], zoom: 16 })
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        setError(
          err.code === 1
            ? 'Location access is blocked. Click the lock icon next to the address bar, allow Location, and try again. You can also search an address or click the map.'
            : 'Could not find your location. Search an address or click the map instead.'
        )
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function pinMapCenter() {
    const c = map?.getCenter()
    if (c) {
      setError('')
      onLocationChange({ lat: c.lat, lng: c.lng })
    }
  }

  function submit() {
    if (!label) return setError('Please choose a label.')
    if (description.trim().length < 15)
      return setError('Please describe what happened (at least a sentence).')
    if (/https?:\/\//i.test(description)) return setError('Links are not allowed in reports.')
    if (!location)
      return setError('Please set a location: search an address, click the map, or use the buttons above.')
    if (new Date(incidentAt) > new Date()) return setError('The incident time cannot be in the future.')

    onSubmit({
      label,
      description: description.trim(),
      incidentAt: new Date(incidentAt).toISOString(),
      lat: location.lat,
      lng: location.lng,
      visibleToFriends,
      resolved,
    })
  }

  return (
    <div className="hm-form">
      <h2>{editing ? 'Edit report' : 'Report an Issue'}</h2>

      <label>
        Label *
        <select value={label} onChange={(e) => setLabel(e.target.value)}>
          <option value="">Choose…</option>
          {LABELS.map((l) => (
            <option key={l.id} value={l.id}>{l.icon} {l.name}</option>
          ))}
        </select>
      </label>

      <label>
        Description *
        <textarea
          rows={4}
          value={description}
          placeholder="What happened? Roughly when? What made the place feel unsafe (no lighting, no staff, no crowds)?"
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label>
        Date and time of incident
        <input type="datetime-local" value={incidentAt} onChange={(e) => setIncidentAt(e.target.value)} />
      </label>

      <fieldset>
        <legend>Location *</legend>
        <SearchBox placeholder="Type an address or landmark" onFound={onLocationChange} />
        <div className="hm-loc-buttons">
          <button type="button" onClick={locateMe} disabled={locating}>
            {locating ? 'Locating…' : 'Use my location'}
          </button>
          <button type="button" onClick={pinMapCenter}>Use map center</button>
        </div>
        <small className="hm-hint">
          {location
            ? location.name || `Pinned: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
            : 'No location yet. You can also click the map to pin the exact spot.'}
        </small>
      </fieldset>

      <label className="hm-check">
        <input type="checkbox" checked={visibleToFriends} onChange={(e) => setVisibleToFriends(e.target.checked)} />
        Let friends see my name on this report (everyone else always sees Anonymous)
      </label>

      {editing && (
        <label className="hm-check">
          <input type="checkbox" checked={resolved} onChange={(e) => setResolved(e.target.checked)} />
          This issue has been fixed
        </label>
      )}

      {error && <p className="hm-error">{error}</p>}

      <div className="hm-form-actions">
        <button type="button" className="hm-primary" onClick={submit}>{editing ? 'Save' : 'Add'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
        {editing && (
          <button type="button" className="hm-danger" onClick={() => onDelete(editing)}>Delete</button>
        )}
      </div>
    </div>
  )
}