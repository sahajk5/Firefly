// Sample data for the Community page.
// TODO: replace with Supabase queries (posts, comments, friendships, friend_requests).

const MIN = 60 * 1000;
const ago = (minutes) => Date.now() - minutes * MIN;

// Labels match the heatmap hotspot categories.
export const LABELS = [
  'Harassment',
  'Public safety',
  'Facility issues',
  'Workplace',
  'Housing',
  'Transit',
];

export const CIRCLES = ['Night commuters', 'Renters', 'Workplace', 'Campus'];

export const KINDS = ['Experience', 'Question', 'Advice'];

// Real names. These are only ever shown between two people who are friends.
export const PEOPLE = {
  me: { name: 'You' },
  f1: { name: 'Maya Chen' },
  f2: { name: 'Priya Sharma' },
  f3: { name: 'Jess Okafor' },
  f4: { name: 'Anika Patel' },
  r1: { name: 'Sara Malik' },
  r2: { name: 'Hannah Lee' },
  o1: { name: 'Noor Haddad' },
  o2: { name: 'Elena Rossi' },
  o3: { name: 'Tara Singh' },
  o4: { name: 'Mei Tanaka' },
  o5: { name: 'Chloe Martin' },
};

export const INITIAL_FRIEND_IDS = ['f1', 'f2', 'f3', 'f4'];

// Incoming friend requests.
export const INITIAL_REQUESTS = ['r1', 'r2'];

// anonymous: true  -> nobody sees the author's name, not even friends.
// anonymous: false -> only friends see the name. Everyone else sees "Anonymous".
export const INITIAL_POSTS = [
  {
    id: 'p1',
    authorId: 'f1',
    anonymous: false,
    kind: 'Experience',
    label: 'Transit',
    circle: 'Night commuters',
    text: "The light at the Maple & 8th bus stop has been out for two weeks, and the 10 pm bus is the last one. I filed it on the heat map. If you use this stop, add yours so it reaches the city faster.",
    location: 'Maple & 8th bus stop',
    verified: true,
    createdAt: ago(12),
    support: 31,
    sameHere: 18,
    comments: [
      { id: 'c1', authorId: 'o2', anonymous: false, text: 'Same stop for me. Just added my report.', createdAt: ago(8) },
      { id: 'c2', authorId: 'f4', anonymous: false, text: 'Thank you for posting this. I was going to walk to Central instead.', createdAt: ago(5) },
    ],
  },
  {
    id: 'p2',
    authorId: 'o1',
    anonymous: false,
    kind: 'Question',
    label: 'Housing',
    circle: 'Renters',
    text: "My landlord keeps letting himself in for 'maintenance checks' with no notice. Is that allowed? Where do I look up what my rights are as a tenant?",
    createdAt: ago(35),
    support: 14,
    sameHere: 22,
    comments: [
      { id: 'c3', authorId: 'o5', anonymous: true, text: "Most provinces require written notice before entry. Check your provincial tenancy office's website for the exact rule where you live.", createdAt: ago(20) },
    ],
  },
  {
    id: 'p3',
    authorId: 'o2',
    anonymous: true,
    kind: 'Experience',
    label: 'Harassment',
    circle: 'Night commuters',
    contentWarning: 'Mentions being followed',
    text: "A man followed me off the train and stayed about ten steps behind me for two blocks. I crossed the street twice and he did the same. I ducked into a 24-hour pharmacy and told the cashier. He left. I'm okay, just shaken. Write it down while you remember the details.",
    location: 'Central Station',
    createdAt: ago(62),
    support: 58,
    sameHere: 41,
    comments: [
      { id: 'c4', authorId: 'f3', anonymous: true, text: 'Going into a shop and telling staff was exactly right. I am glad you are okay.', createdAt: ago(40) },
    ],
  },
  {
    id: 'p4',
    authorId: 'f2',
    anonymous: false,
    kind: 'Advice',
    label: 'Workplace',
    circle: 'Night commuters',
    text: 'My late-shift checklist, in case it helps someone:',
    checklist: [
      'Text a friend when I leave, and again when I get home',
      'Charge my phone before the shift ends',
      'Walk the lit route, even if it is five minutes longer',
      'Keep one earbud out',
      'Know which shops stay open past midnight',
    ],
    createdAt: ago(130),
    support: 77,
    sameHere: 12,
    comments: [],
  },
  {
    id: 'p5',
    authorId: 'o3',
    anonymous: false,
    kind: 'Question',
    label: 'Workplace',
    circle: 'Workplace',
    text: "How do you report a coworker's behaviour when he is close friends with the person in HR? I have notes with dates, but I do not know who to send them to.",
    createdAt: ago(185),
    support: 26,
    sameHere: 19,
    comments: [
      { id: 'c5', authorId: 'f2', anonymous: false, text: 'Keep your dated notes somewhere outside work systems. Many workplaces also have a second reporting route, such as a manager above HR or an external hotline. Worth checking your handbook.', createdAt: ago(150) },
      { id: 'c6', authorId: 'o4', anonymous: true, text: "A union rep or your province's labour office can also tell you your options.", createdAt: ago(120) },
    ],
  },
  {
    id: 'p6',
    authorId: 'f3',
    anonymous: true,
    kind: 'Advice',
    label: 'Public safety',
    circle: 'Campus',
    text: "Most campuses run a free walk-safe service that sends someone to meet you wherever you are. I only found out in third year. Look up your campus security number and save it in your phone today.",
    createdAt: ago(300),
    support: 64,
    sameHere: 9,
    comments: [],
  },
  {
    id: 'p7',
    authorId: 'o4',
    anonymous: true,
    kind: 'Experience',
    label: 'Public safety',
    circle: 'Renters',
    urgent: true,
    contentWarning: 'Mentions stalking',
    text: "Someone has been waiting outside my building two nights in a row and watches me come home. I have not spoken to him. I do not know whether to call the police or if that would be overreacting.",
    createdAt: ago(360),
    support: 47,
    sameHere: 15,
    comments: [
      { id: 'c7', authorId: 'f1', anonymous: false, text: 'You would not be overreacting. If you feel unsafe, call. Please also tell your building manager and a friend today.', createdAt: ago(330) },
    ],
  },
  {
    id: 'p8',
    authorId: 'r1',
    anonymous: false,
    kind: 'Question',
    label: 'Transit',
    circle: 'Night commuters',
    text: 'Does anyone know if the night bus to Riverside Park has a stop request button on the platform side? I am new to the route and want to plan where to wait.',
    createdAt: ago(520),
    support: 8,
    sameHere: 6,
    comments: [],
  },
  {
    id: 'p9',
    authorId: 'f4',
    anonymous: false,
    kind: 'Experience',
    label: 'Transit',
    circle: 'Night commuters',
    text: "A man kept staring and moving closer on the late bus. I stood up and moved next to the driver, and texted a friend. Nothing else happened, but I felt better right away. Sitting near the driver is a small thing that works.",
    createdAt: ago(60 * 26),
    support: 92,
    sameHere: 63,
    comments: [],
  },
  {
    id: 'p10',
    authorId: 'o5',
    anonymous: true,
    kind: 'Advice',
    label: 'Facility issues',
    circle: 'Night commuters',
    text: "When you report a broken streetlight to the city, include the pole number. It is usually on a small sticker at eye level. Reports with a pole number tend to get fixed faster.",
    createdAt: ago(60 * 30),
    support: 53,
    sameHere: 4,
    comments: [],
  },
];
