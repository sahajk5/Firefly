import { useState } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { searchPlace } from './geocode'

export default function SearchBox({ onFound, placeholder = 'Search an address, station, or landmark' }) {
  const { current: map } = useMap()
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  async function search() {
    if (!query.trim()) return
    try {
      const loc = await searchPlace(query)
      map?.flyTo({ center: [loc.lng, loc.lat], zoom: 16 })
      setError('')
      onFound(loc)
    } catch {
      setError('Location not found')
    }
  }

  return (
    <div className="hm-search">
      <input
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && search()}
      />
      <button type="button" onClick={search}>Search</button>
      {error && <small className="hm-error">{error}</small>}
    </div>
  )
}