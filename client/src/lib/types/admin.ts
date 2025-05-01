export type User = {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  blackpoints: number;
  points: number;
  points_today: number;
  points_this_week: number;
  points_this_month: number;
  points_this_year: number;
  tier_name: string; // e.g., "silver", "gold"
  is_active: boolean;
  completed_1vs1_matches: number;
  completed_problems: number;
  created_at: string; // ISO timestamp
  is_blocked: boolean;
};

export type Moderator = {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  permission: string;
  problems_added: number;
  blackpoints: number;
  created_at: string;
  is_blocked: boolean;
};
