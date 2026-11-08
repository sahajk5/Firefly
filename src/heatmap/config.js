export const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 } // change to your city

export const CURRENT_USER_ID = 'me'
export const FRIENDS = { u2: 'Aisha', u3: 'Priya' }

export const HEAT_COLORS = [
  [124, 58, 237, 40],
  [124, 58, 237, 120],
  [110, 100, 230, 170],
  [60, 150, 200, 200],
  [30, 175, 185, 220],
  [20, 184, 166, 255],
]

export const MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
}