import { useMemo, useRef, useState } from 'react'
import Map, { MapProvider, Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import './heatmap.css'
import { CURRENT_USER_ID, DEFAULT_CENTER, MAP_STYLE } from './config'
import { useReports } from './useReports'
import HeatmapOverlay from './HeatmapOverlay'
import LegendBar from './LegendBar'
import SearchBox from './SearchBox'
import LabelSidebar from './LabelSidebar'
import StatsBar from './StatsBar'
import ReportPanel from './ReportPanel'
import ReportForm from './ReportForm'

export default function HeatmapPage() {
  const { reports, addReport, updateReport, deleteReport } = useReports()
  const mapRef = useRef(null)
  const [activeLabel, setActiveLabel] = useState(null)
  const [selected, setSelected] = useState(null)
  const [formState, setFormState] = useState(null) // null | {mode:'new'} | {mode:'edit', report}
  const [draftLocation, setDraftLocation] = useState(null)

  const visibleReports = useMemo(
    () => (activeLabel ? reports.filter((r) => r.label === activeLabel) : reports),
    [reports, activeLabel]
  )

  const heatPoints = useMemo(
    () =>
      visibleReports
        .filter((r) => r.weight > 0)
        .map((r) => ({ lat: r.lat, lng: r.lng, weight: r.weight })),
    [visibleReports]
  )

  // your own pins are drawn last so they sit on top
  const pinReports = useMemo(
    () =>
      [...visibleReports].sort(
        (a, b) => Number(a.authorId === CURRENT_USER_ID) - Number(b.authorId === CURRENT_USER_ID)
      ),
    [visibleReports]
  )

  const stats = useMemo(
    () => ({
      verified: reports.filter((r) => r.status === 'verified').length,
      resolved: reports.filter((r) => r.status === 'resolved').length,
    }),
    [reports]
  )

  function flyTo(loc) {
    const map = mapRef.current
    if (!map) return
    map.flyTo({ center: [loc.lng, loc.lat], zoom: Math.max(map.getZoom(), 15) })
  }

  function openNewForm() {
    setSelected(null)
    setDraftLocation(null)
    setFormState({ mode: 'new' })
  }

  function openEditForm(report) {
    setSelected(null)
    setDraftLocation({ lat: report.lat, lng: report.lng })
    setFormState({ mode: 'edit', report })
  }

  function closeForm() {
    setFormState(null)
    setDraftLocation(null)
  }

  function handleSubmit(data) {
    if (formState.mode === 'edit') updateReport(formState.report.id, data)
    else addReport(data)
    closeForm()
    // show the person where their report landed
    const loc = { lat: data.lat, lng: data.lng }
    setSelected(loc)
    flyTo(loc)
  }

  function handleDelete(report) {
    if (window.confirm('Delete this report?')) {
      deleteReport(report.id)
      closeForm()
    }
  }

  function handleMapClick(e) {
    const loc = { lat: e.lngLat.lat, lng: e.lngLat.lng }
    if (formState) setDraftLocation(loc)
    else setSelected(loc)
  }

  return (
    <MapProvider>
      <div className="hm-page">
        <div className="hm-top">
          <LegendBar />
          <SearchBox onFound={(loc) => (formState ? setDraftLocation(loc) : setSelected(loc))} />
        </div>

        <div className="hm-body">
          <LabelSidebar
            active={activeLabel}
            onSelect={(id) => setActiveLabel((prev) => (prev === id ? null : id))}
            onShowAll={() => setActiveLabel(null)}
          />

          <div className="hm-map">
            <Map
              ref={mapRef}
              initialViewState={{ latitude: DEFAULT_CENTER.lat, longitude: DEFAULT_CENTER.lng, zoom: 13 }}
              mapStyle={MAP_STYLE}
              style={{ width: '100%', height: '100%' }}
              onClick={handleMapClick}
            >
              <NavigationControl position="bottom-left" showCompass={false} />
              <HeatmapOverlay points={heatPoints} />

              {pinReports.map((r) => (
                <Marker
                  key={r.id}
                  latitude={r.lat}
                  longitude={r.lng}
                  anchor="center"
                  onClick={(e) => {
                    if (formState) return // let the map click set the form location
                    e.originalEvent.stopPropagation()
                    setSelected({ lat: r.lat, lng: r.lng })
                  }}
                >
                  <div
                    className={`hm-pin is-${r.status} ${r.authorId === CURRENT_USER_ID ? 'is-mine' : ''}`}
                    title={r.authorId === CURRENT_USER_ID ? 'Your report' : 'Report'}
                  />
                </Marker>
              ))}

              {selected && !formState && (
                <Marker latitude={selected.lat} longitude={selected.lng} color="#7c3aed" />
              )}
              {draftLocation && formState && (
                <Marker latitude={draftLocation.lat} longitude={draftLocation.lng} color="#14b8a6" />
              )}
            </Map>

            {selected && !formState && (
              <ReportPanel
                key={`${selected.lat},${selected.lng}`}
                location={selected}
                reports={visibleReports}
                onClose={() => setSelected(null)}
                onEdit={openEditForm}
                onToggleResolved={(r) => updateReport(r.id, { resolved: !r.resolved })}
              />
            )}

            {formState && (
              <ReportForm
                key={formState.report?.id ?? 'new'}
                editing={formState.report ?? null}
                location={draftLocation}
                onLocationChange={setDraftLocation}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                onCancel={closeForm}
              />
            )}

            {!formState && (
              <button type="button" className="hm-fab" onClick={openNewForm}>+ Report an Issue</button>
            )}
          </div>
        </div>

        <StatsBar verified={stats.verified} resolved={stats.resolved} />
      </div>
    </MapProvider>
  )
}