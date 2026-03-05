export interface Team {
  name: string
  abbreviation: string
  record: string
  logo: string
  color: string
  winProbability: number
  spread: number
  overUnder: number
}

export interface GamePrediction {
  id: string
  homeTeam: Team
  awayTeam: Team
  date: string
  time: string
  venue: string
  week: string
  confidence: number
  status: "upcoming" | "live" | "final"
  quarter?: string
  gameTime?: string
  homeScore?: number
  awayScore?: number
}

export interface WpaPlay {
  play: number
  quarter: string
  description: string
  homeWp: number
  wpaChange: number
  team: string
}

export interface PlayerStat {
  name: string
  team: string
  position: string
  wpa: number
  epa: number
  successRate: number
  plays: number
}

export interface WeeklyTrend {
  week: string
  accuracy: number
  predictions: number
  correct: number
}

// Static prediction data
export const predictions: GamePrediction[] = [
  {
    id: "1",
    homeTeam: {
      name: "Kansas City Chiefs",
      abbreviation: "KC",
      record: "12-3",
      logo: "KC",
      color: "#E31837",
      winProbability: 0.68,
      spread: -3.5,
      overUnder: 48.5,
    },
    awayTeam: {
      name: "Buffalo Bills",
      abbreviation: "BUF",
      record: "11-4",
      logo: "BUF",
      color: "#00338D",
      winProbability: 0.32,
      spread: 3.5,
      overUnder: 48.5,
    },
    date: "Sun, Jan 12",
    time: "4:25 PM ET",
    venue: "Arrowhead Stadium",
    week: "Week 18",
    confidence: 72,
    status: "live",
    quarter: "Q3",
    gameTime: "7:42",
    homeScore: 24,
    awayScore: 17,
  },
  {
    id: "2",
    homeTeam: {
      name: "San Francisco 49ers",
      abbreviation: "SF",
      record: "11-4",
      logo: "SF",
      color: "#AA0000",
      winProbability: 0.61,
      spread: -2.5,
      overUnder: 45.5,
    },
    awayTeam: {
      name: "Dallas Cowboys",
      abbreviation: "DAL",
      record: "10-5",
      logo: "DAL",
      color: "#003594",
      winProbability: 0.39,
      spread: 2.5,
      overUnder: 45.5,
    },
    date: "Sun, Jan 12",
    time: "8:20 PM ET",
    venue: "Levi's Stadium",
    week: "Week 18",
    confidence: 65,
    status: "upcoming",
  },
  {
    id: "3",
    homeTeam: {
      name: "Philadelphia Eagles",
      abbreviation: "PHI",
      record: "12-3",
      logo: "PHI",
      color: "#004C54",
      winProbability: 0.73,
      spread: -6.5,
      overUnder: 43.0,
    },
    awayTeam: {
      name: "New York Giants",
      abbreviation: "NYG",
      record: "6-9",
      logo: "NYG",
      color: "#0B2265",
      winProbability: 0.27,
      spread: 6.5,
      overUnder: 43.0,
    },
    date: "Sat, Jan 11",
    time: "1:00 PM ET",
    venue: "Lincoln Financial Field",
    week: "Week 18",
    confidence: 81,
    status: "final",
    homeScore: 31,
    awayScore: 13,
  },
  {
    id: "4",
    homeTeam: {
      name: "Baltimore Ravens",
      abbreviation: "BAL",
      record: "13-2",
      logo: "BAL",
      color: "#241773",
      winProbability: 0.77,
      spread: -7.0,
      overUnder: 51.5,
    },
    awayTeam: {
      name: "Miami Dolphins",
      abbreviation: "MIA",
      record: "9-6",
      logo: "MIA",
      color: "#008E97",
      winProbability: 0.23,
      spread: 7.0,
      overUnder: 51.5,
    },
    date: "Sun, Jan 12",
    time: "1:00 PM ET",
    venue: "M&T Bank Stadium",
    week: "Week 18",
    confidence: 84,
    status: "upcoming",
  },
  {
    id: "5",
    homeTeam: {
      name: "Detroit Lions",
      abbreviation: "DET",
      record: "11-4",
      logo: "DET",
      color: "#0076B6",
      winProbability: 0.58,
      spread: -1.5,
      overUnder: 52.0,
    },
    awayTeam: {
      name: "Green Bay Packers",
      abbreviation: "GB",
      record: "10-5",
      logo: "GB",
      color: "#203731",
      winProbability: 0.42,
      spread: 1.5,
      overUnder: 52.0,
    },
    date: "Sun, Jan 12",
    time: "1:00 PM ET",
    venue: "Ford Field",
    week: "Week 18",
    confidence: 56,
    status: "upcoming",
  },
]

// WPA chart data for the live game
export const wpaChartData: WpaPlay[] = [
  { play: 1, quarter: "Q1", description: "KC kickoff return to 30-yard line", homeWp: 0.58, wpaChange: 0.02, team: "KC" },
  { play: 5, quarter: "Q1", description: "KC pass complete for 22 yards", homeWp: 0.62, wpaChange: 0.04, team: "KC" },
  { play: 10, quarter: "Q1", description: "KC touchdown - Mahomes to Kelce 8 yd", homeWp: 0.71, wpaChange: 0.09, team: "KC" },
  { play: 15, quarter: "Q1", description: "BUF pass complete for 35 yards", homeWp: 0.65, wpaChange: -0.06, team: "BUF" },
  { play: 20, quarter: "Q1", description: "BUF field goal 38 yards", homeWp: 0.62, wpaChange: -0.03, team: "BUF" },
  { play: 25, quarter: "Q2", description: "KC rushing for 15 yards", homeWp: 0.64, wpaChange: 0.02, team: "KC" },
  { play: 30, quarter: "Q2", description: "KC interception thrown", homeWp: 0.55, wpaChange: -0.09, team: "BUF" },
  { play: 35, quarter: "Q2", description: "BUF touchdown - Allen rush 2 yd", homeWp: 0.48, wpaChange: -0.07, team: "BUF" },
  { play: 40, quarter: "Q2", description: "KC pass complete for 45 yards", homeWp: 0.56, wpaChange: 0.08, team: "KC" },
  { play: 45, quarter: "Q2", description: "KC touchdown - Pacheco 1 yd run", homeWp: 0.65, wpaChange: 0.09, team: "KC" },
  { play: 50, quarter: "Q2", description: "BUF incomplete pass, end of half", homeWp: 0.63, wpaChange: -0.02, team: "BUF" },
  { play: 55, quarter: "Q3", description: "KC kickoff return to 35-yard line", homeWp: 0.64, wpaChange: 0.01, team: "KC" },
  { play: 60, quarter: "Q3", description: "KC rushing for 12 yards", homeWp: 0.66, wpaChange: 0.02, team: "KC" },
  { play: 65, quarter: "Q3", description: "KC field goal 31 yards", homeWp: 0.70, wpaChange: 0.04, team: "KC" },
  { play: 70, quarter: "Q3", description: "BUF sacked, fumble recovered by KC", homeWp: 0.76, wpaChange: 0.06, team: "KC" },
  { play: 75, quarter: "Q3", description: "KC pass complete for 18 yards", homeWp: 0.78, wpaChange: 0.02, team: "KC" },
]

export const topPlayers: PlayerStat[] = [
  { name: "Patrick Mahomes", team: "KC", position: "QB", wpa: 2.34, epa: 18.7, successRate: 0.58, plays: 42 },
  { name: "Josh Allen", team: "BUF", position: "QB", wpa: 1.87, epa: 14.2, successRate: 0.52, plays: 38 },
  { name: "Travis Kelce", team: "KC", position: "TE", wpa: 1.12, epa: 8.4, successRate: 0.72, plays: 12 },
  { name: "Stefon Diggs", team: "BUF", position: "WR", wpa: 0.95, epa: 7.1, successRate: 0.61, plays: 10 },
  { name: "Isiah Pacheco", team: "KC", position: "RB", wpa: 0.78, epa: 5.3, successRate: 0.55, plays: 16 },
  { name: "James Cook", team: "BUF", position: "RB", wpa: 0.62, epa: 4.8, successRate: 0.49, plays: 14 },
]

export const weeklyTrends: WeeklyTrend[] = [
  { week: "Wk 10", accuracy: 68, predictions: 16, correct: 11 },
  { week: "Wk 11", accuracy: 75, predictions: 16, correct: 12 },
  { week: "Wk 12", accuracy: 71, predictions: 14, correct: 10 },
  { week: "Wk 13", accuracy: 81, predictions: 16, correct: 13 },
  { week: "Wk 14", accuracy: 69, predictions: 16, correct: 11 },
  { week: "Wk 15", accuracy: 78, predictions: 16, correct: 12 },
  { week: "Wk 16", accuracy: 82, predictions: 16, correct: 13 },
  { week: "Wk 17", accuracy: 76, predictions: 16, correct: 12 },
  { week: "Wk 18", accuracy: 79, predictions: 8, correct: 6 },
]

export const matchupStats = {
  home: {
    passingYards: 287,
    rushingYards: 134,
    totalYards: 421,
    turnovers: 1,
    thirdDown: "6/12",
    redZone: "3/4",
    timeOfPossession: "32:18",
    sacks: 3,
  },
  away: {
    passingYards: 243,
    rushingYards: 98,
    totalYards: 341,
    turnovers: 2,
    thirdDown: "4/11",
    redZone: "2/3",
    timeOfPossession: "27:42",
    sacks: 1,
  },
}
