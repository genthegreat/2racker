export interface Amenity {
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
  account_id: any;
  account_name: any;
  status: any;
  amount_due: any;
  amount_paid: any;
  balance: any;
  start_date?: any;
  projects?: Project[];
}

export interface Profile {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}
