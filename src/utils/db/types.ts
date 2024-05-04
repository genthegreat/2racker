export interface Amenity {
  amenity_id: number;
  amenity_name: string;
  default_amount: number;
  category: string;
  project_id: number;
  project_name?: any;
}

export interface Project {
  project_id: any;
  project_name: any;
  description: any;
  amount_due: any;
  amount_paid: any;
  balance: any;
  projects?: Project[];
}

export interface Account {
  account_id: number;
  account_name: string;
  status: string;
  amount_due: number;
  amount_paid: number;
  balance: number;
  start_date?: string;
  projects?: Project[];
}

export interface Profile {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}
