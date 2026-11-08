import { useEffect } from 'react'
import { useControl } from 'react-map-gl/maplibre'
import { MapboxOverlay } from '@deck.gl/mapbox'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { HEAT_COLORS } from './config'

export default function HeatmapOverlay({ points }) {
  const overlay = useControl(() => new MapboxOverlay({ layers: [] }))

  useEffect(() => {
    overlay.setProps({
      layers: [
        new HeatmapLayer({
          id: 'safety-heat',
          data: points,
          getPosition: (d) => [d.lng, d.lat],
          getWeight: (d) => d.weight,
          aggregation: 'SUM',
          radiusPixels: 60,
          intensity: 1,
          threshold: 0.05,
          colorRange: HEAT_COLORS,
        }),
      ],
    })
  }, [overlay, points])

  return null
}