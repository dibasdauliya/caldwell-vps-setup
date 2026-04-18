export type Engine = "mongodb" | "postgresql" | "redis";

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}
