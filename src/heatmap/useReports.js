import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeSeedReports } from './seedReports'
import { getStatus, getWeight } from './risk'
import { CURRENT_USER_ID } from './config'

const KEY = 'firefly-reports-v2'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return makeSeedReports()
}

export function useReports() {
  const [reports, setReports] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(reports))
    } catch {
      /* ignore */
    }
  }, [reports])

  const addReport = useCallback((data) => {
    setReports((prev) => [
      { ...data, id: crypto.randomUUID(), authorId: CURRENT_USER_ID, resolved: false, history: [] },
      ...prev,
    ])
  }, [])

  const updateReport = useCallback((id, changes) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              ...changes,
              history: [
                ...r.history,
                {
                  at: new Date().toISOString(),
                  snapshot: {
                    label: r.label,
                    description: r.description,
                    lat: r.lat,
                    lng: r.lng,
                    resolved: r.resolved,
                  },
                },
              ],
            }
          : r
      )
    )
  }, [])

  const deleteReport = useCallback((id) => {
    setReports((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const enriched = useMemo(
    () =>
      reports.map((r) => {
        const status = getStatus(r, reports)
        return { ...r, status, weight: getWeight(r, status) }
      }),
    [reports]
  )

  return { reports: enriched, addReport, updateReport, deleteReport }
}