export interface Team {
  id: string
  name: string
  flag: string
  group_letter: string
  confederation: string
}

export interface Match {
  id: string
  home_team_id: string
  away_team_id: string
  match_date: string
  stage: string
  group_letter: string | null
  venue: string | null
  home_score: number | null
  away_score: number | null
  status: 'scheduled' | 'live' | 'finished'
  sort_order: number
  home_team?: Team
  away_team?: Team
  user_prediction?: Prediction
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  home_score: number
  away_score: number
  points: number | null
}

export interface Profile {
  id: string
  display_name: string
  avatar_emoji: string
  created_at: string
}

export interface League {
  id: string
  name: string
  code: string
  created_by: string
  scoring_mode: string
  created_at: string
}

export interface LeagueStanding {
  league_id: string
  user_id: string
  display_name: string
  avatar_emoji: string
  total_points: number
  exact_scores: number
  correct_results: number
  wrong_predictions: number
}

export interface ChampionPrediction {
  user_id: string
  league_id: string
  team_id: string
  is_correct: boolean
  points_awarded: number
}
