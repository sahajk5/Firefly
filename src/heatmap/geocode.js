const BASE = 'https://nominatim.openstreetmap.org'

export async function searchPlace(query) {
  const res = await fetch(`${BASE}/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`)
  const data = await res.json()
  if (!data.length) throw new Error('not found')
  return { lat: Number(data[0].lat), lng: Number(data[0].lon), name: data[0].display_name }
}

export async function reverseGeocode({ lat, lng }) {
  const res = await fetch(`${BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
  const data = await res.json()
  return data.display_name ?? ''
}