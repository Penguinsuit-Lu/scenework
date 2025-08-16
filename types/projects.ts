export interface SearchParams {
  q?: string;
  role_needed?: string;
  location?: string;
  pay_status?: string;
  min_day_rate?: string;
  start_date?: string;
  end_date?: string;
  project_type?: string;
  page?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role_needed: string;
  location: string;
  pay_status: string;
  min_day_rate: number;
  max_day_rate: number;
  start_date: string;
  end_date: string;
  project_type: string;
  genre: string;
  budget_range: string;
  crew_size: number;
  requirements: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFilters {
  q: string;
  role_needed: string;
  location: string;
  pay_status: string;
  min_day_rate: string;
  start_date: string;
  end_date: string;
  project_type: string;
}
