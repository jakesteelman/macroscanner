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
      entries: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string
          entry_id: string | null
          id: string
          photo_url: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          entry_id?: string | null
          id?: string
          photo_url: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          entry_id?: string | null
          id?: string
          photo_url?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "entries"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          confidence: number | null
          corrected_at: string | null
          corrected_fdc_id: number | null
          corrected_name: string | null
          corrected_quantity: number | null
          corrected_unit: string | null
          created_at: string
          fdc_id: number | null
          id: string
          is_correct: boolean | null
          name: string
          photo_id: string
          quantity: number
          unit: string
        }
        Insert: {
          confidence?: number | null
          corrected_at?: string | null
          corrected_fdc_id?: number | null
          corrected_name?: string | null
          corrected_quantity?: number | null
          corrected_unit?: string | null
          created_at?: string
          fdc_id?: number | null
          id?: string
          is_correct?: boolean | null
          name: string
          photo_id: string
          quantity: number
          unit: string
        }
        Update: {
          confidence?: number | null
          corrected_at?: string | null
          corrected_fdc_id?: number | null
          corrected_name?: string | null
          corrected_quantity?: number | null
          corrected_unit?: string | null
          created_at?: string
          fdc_id?: number | null
          id?: string
          is_correct?: boolean | null
          name?: string
          photo_id?: string
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_corrected_fdc_id_fkey"
            columns: ["corrected_fdc_id"]
            isOneToOne: false
            referencedRelation: "usda_foods"
            referencedColumns: ["fdc_id"]
          },
          {
            foreignKeyName: "predictions_fdc_id_fkey"
            columns: ["fdc_id"]
            isOneToOne: false
            referencedRelation: "usda_foods"
            referencedColumns: ["fdc_id"]
          },
          {
            foreignKeyName: "predictions_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      usda_foods: {
        Row: {
          alcohol: number | null
          caffeine: number | null
          carbs: number | null
          cholesterol: number | null
          created_at: string
          data_type: string | null
          density: number | null
          embedding: string | null
          fat: number | null
          fat_mono: number | null
          fat_poly: number | null
          fat_sat: number | null
          fat_trans: number | null
          fdc_id: number
          fiber: number | null
          kcal: number | null
          name: string
          protein: number | null
          sodium: number | null
          sugar: number | null
          sugar_added: number | null
          updated_at: string | null
        }
        Insert: {
          alcohol?: number | null
          caffeine?: number | null
          carbs?: number | null
          cholesterol?: number | null
          created_at?: string
          data_type?: string | null
          density?: number | null
          embedding?: string | null
          fat?: number | null
          fat_mono?: number | null
          fat_poly?: number | null
          fat_sat?: number | null
          fat_trans?: number | null
          fdc_id?: number
          fiber?: number | null
          kcal?: number | null
          name: string
          protein?: number | null
          sodium?: number | null
          sugar?: number | null
          sugar_added?: number | null
          updated_at?: string | null
        }
        Update: {
          alcohol?: number | null
          caffeine?: number | null
          carbs?: number | null
          cholesterol?: number | null
          created_at?: string
          data_type?: string | null
          density?: number | null
          embedding?: string | null
          fat?: number | null
          fat_mono?: number | null
          fat_poly?: number | null
          fat_sat?: number | null
          fat_trans?: number | null
          fdc_id?: number
          fiber?: number | null
          kcal?: number | null
          name?: string
          protein?: number | null
          sodium?: number | null
          sugar?: number | null
          sugar_added?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          opt_in_marketing: boolean
          opt_in_research: boolean
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          opt_in_marketing?: boolean
          opt_in_research?: boolean
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          opt_in_marketing?: boolean
          opt_in_research?: boolean
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      search_usda_foods: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          fdc_id: number
          name: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
