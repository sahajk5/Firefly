import { DEFAULT_CENTER } from './config'

const DAY = 86400000
const HOUR = 3600000

const DESCRIPTIONS = {
  transit: [
    'The bus stop is poorly lit and nobody was around when I waited after 10 pm.',
    'A man followed me off the bus and stayed behind me for two blocks.',
    'The shelter light has been out for weeks. I felt very exposed waiting here.',
    'The train platform was empty with no staff on duty late in the evening.',
    'The driver ignored a drunk passenger who was harassing other riders.',
    'The last bus is so late that this stop is completely deserted by then.',
  ],
  facility: [
    'Street light has been broken for a month and the whole corner is dark at night.',
    'The security camera at the entrance has a cable hanging out and clearly is not working.',
    'The station help desk is always unstaffed in the evening.',
    'This underpass is very dim and the emergency button does nothing.',
    'Overgrown bushes block the view of the path, and the lamp next to it is dead.',
  ],
  harassment: [
    'Group of men catcalled me as I walked past the entrance.',
    'Someone kept following me and making comments until I went into a shop.',
    'Verbal abuse from a man outside the bar when I said no to talking to him.',
    'Was grabbed in a crowded section while leaving. Happens here often, according to friends.',
  ],
  'public-safety': [
    'My phone was snatched here around 9 pm. There were no people nearby.',
    'A man has been loitering and watching people walking home. Felt like stalking.',
    'There was a fight outside and it took a long time for anyone to respond.',
  ],
}

const clusters = [
  { dLat: 0.004, dLng: 0.003, label: 'transit', n: 6 },
  { dLat: -0.006, dLng: 0.005, label: 'facility', n: 5 },
  { dLat: 0.002, dLng: -0.008, label: 'harassment', n: 4 },
  { dLat: -0.003, dLng: -0.004, label: 'public-safety', n: 3 },
]

export function makeSeedReports() {
  const out = []
  let i = 0
  clusters.forEach((c) => {
    for (let k = 0; k < c.n; k++) {
      i++
      out.push({
        id: `seed-${i}`,
        label: c.label,
        description: DESCRIPTIONS[c.label][k % DESCRIPTIONS[c.label].length],
        lat: DEFAULT_CENTER.lat + c.dLat + (k % 3) * 0.0003,
        lng: DEFAULT_CENTER.lng + c.dLng + (k % 2) * 0.0003,
        incidentAt: new Date(Date.now() - (k * 12 + 3) * DAY - (k * 5 + 2) * HOUR).toISOString(),
        authorId: `u${(k % 4) + 2}`,
        visibleToFriends: k % 3 !== 2,
        resolved: false,
        history: [],
      })
    }
  })
  return out
}