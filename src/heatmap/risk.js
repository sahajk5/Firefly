import { getLabel } from './labels'
import { distanceMeters } from './geo'

export const NEARBY_METERS = 150
const CORROBORATION_METERS = 100
const HALF_LIFE_DAYS = 90
const DAY = 86400000

export function getStatus(report, all) {
  if (report.resolved) return 'resolved'
  const corroborated = all.some(
    (o) =>
      o.id !== report.id &&
      !o.resolved &&
      o.label === report.label &&
      o.authorId !== report.authorId &&
      distanceMeters(o, report) <= CORROBORATION_METERS
  )
  return corroborated ? 'verified' : 'unconfirmed'
}

export function getWeight(report, status) {
  if (status === 'resolved') return 0
  const ageDays = Math.max(0, (Date.now() - new Date(report.incidentAt).getTime()) / DAY)
  const recency = Math.pow(0.5, ageDays / HALF_LIFE_DAYS)
  const verification = status === 'verified' ? 1 : 0.5
  return getLabel(report.label).severity * recency * verification
}

export function riskLevel(score) {
  if (score >= 6) return 'high'
  if (score >= 2.5) return 'medium'
  return 'low'
}

export function summarize(list) {
  const cutoff = Date.now() - 180 * DAY
  return {
    recent: list.filter((r) => new Date(r.incidentAt).getTime() >= cutoff).length,
    verified: list.filter((r) => r.status === 'verified').length,
  }
}