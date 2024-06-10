export interface Transaction {
  transaction_id: number,
  amount_paid: number,
  transaction_date: string,
  platform: string,
  receipt_info: string,
  status: string,
  notes: string,
  amenity_id: number;
}

export interface Amenity {
  amenity_id: number;
  amenity_name: string;
  default_amount: number;
  category: string;
  project_id: number;
  transactions?: Transaction[];
}

export interface Project {
  project_id: number;
  account_id: number;
  project_name: string;
  description: string;
  amount_due: number;
  amount_paid: number;
  amenities?: Amenity[];
}

export interface Account {
  account_id: number;
  user_id?: string;
  account_name: string;
  status: string;
  amount_due: number;
  amount_paid: number;
  balance: number;
  start_date?: string;
  projects?: Project[];
}

export interface Profile {
  id: string;
  updated_at: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}
