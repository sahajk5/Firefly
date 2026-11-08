export const LABELS = [
    { id: 'harassment', name: 'Harassment', icon: '📢', severity: 3 },
    { id: 'public-safety', name: 'Public Safety', icon: '🛡️', severity: 5 },
    { id: 'facility', name: 'Facility Issues', icon: '💡', severity: 2 },
    { id: 'workplace', name: 'Workplace', icon: '💼', severity: 3 },
    { id: 'housing', name: 'Housing', icon: '🏠', severity: 3 },
    { id: 'transit', name: 'Transit', icon: '🚌', severity: 3 },
  ]
  
  export const getLabel = (id) => LABELS.find((l) => l.id === id)