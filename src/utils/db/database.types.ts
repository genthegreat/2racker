export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          account_id: number
          account_name: string | null
          amount_due: number
          amount_paid: number
          balance: number
          start_date: string
          status: string | null
          user_id: string
        }
        Insert: {
          account_id?: never
          account_name?: string | null
          amount_due?: number
          amount_paid?: number
          balance?: number
          start_date: string
          status?: string | null
          user_id: string
        }
        Update: {
          account_id?: never
          account_name?: string | null
          amount_due?: number
          amount_paid?: number
          balance?: number
          start_date?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      amenities: {
        Row: {
          amenity_id: number
          amenity_name: string
          category: string | null
          default_amount: number | null
          project_id: number | null
        }
        Insert: {
          amenity_id?: never
          amenity_name: string
          category?: string | null
          default_amount?: number | null
          project_id?: number | null
        }
        Update: {
          amenity_id?: never
          amenity_name?: string
          category?: string | null
          default_amount?: number | null
          project_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_amenities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          account_id: number
          amount_due: number | null
          amount_paid: number | null
          description: string | null
          project_id: number
          project_name: string
        }
        Insert: {
          account_id: number
          amount_due?: number | null
          amount_paid?: number | null
          description?: string | null
          project_id?: never
          project_name: string
        }
        Update: {
          account_id?: number
          amount_due?: number | null
          amount_paid?: number | null
          description?: string | null
          project_id?: never
          project_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: number
          amenity_id: number
          amount_paid: number
          notes: string | null
          platform: string
          receipt_info: string | null
          status: string | null
          transaction_date: string
          transaction_id: number
        }
        Insert: {
          account_id: number
          amenity_id: number
          amount_paid: number
          notes?: string | null
          platform: string
          receipt_info?: string | null
          status?: string | null
          transaction_date: string
          transaction_id?: never
        }
        Update: {
          account_id?: number
          amenity_id?: number
          amount_paid?: number
          notes?: string | null
          platform?: string
          receipt_info?: string | null
          status?: string | null
          transaction_date?: string
          transaction_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "transactions_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["amenity_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_account: {
        Args: {
          account_id: number
        }
        Returns: boolean
      }
      delete_amenity: {
        Args: {
          amenity_id: number
        }
        Returns: undefined
      }
      delete_project: {
        Args: {
          project_id: number
        }
        Returns: undefined
      }
      get_account_details: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      transaction_status: "success" | "failure" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
