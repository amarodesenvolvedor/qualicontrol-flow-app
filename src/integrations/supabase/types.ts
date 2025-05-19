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
      audit_reports: {
        Row: {
          audit_date: string
          created_at: string
          created_by: string | null
          department_id: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          responsible_auditor: string
          status: string
          title: string
        }
        Insert: {
          audit_date: string
          created_at?: string
          created_by?: string | null
          department_id: string
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          responsible_auditor: string
          status?: string
          title: string
        }
        Update: {
          audit_date?: string
          created_at?: string
          created_by?: string | null
          department_id?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          responsible_auditor?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_reports_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          address: string
          cep: string
          city: string
          cnpj: string
          companyname: string
          createdat: string
          email: string
          id: string
          phone: string
          state: string
          updatedat: string
        }
        Insert: {
          address?: string
          cep?: string
          city?: string
          cnpj?: string
          companyname?: string
          createdat?: string
          email?: string
          id?: string
          phone?: string
          state?: string
          updatedat?: string
        }
        Update: {
          address?: string
          cep?: string
          city?: string
          cnpj?: string
          companyname?: string
          createdat?: string
          email?: string
          id?: string
          phone?: string
          state?: string
          updatedat?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          group_type: Database["public"]["Enums"]["department_group"] | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_type?: Database["public"]["Enums"]["department_group"] | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_type?: Database["public"]["Enums"]["department_group"] | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      non_conformance_files: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          non_conformance_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          non_conformance_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          non_conformance_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "non_conformance_files_non_conformance_id_fkey"
            columns: ["non_conformance_id"]
            isOneToOne: false
            referencedRelation: "non_conformances"
            referencedColumns: ["id"]
          },
        ]
      }
      non_conformance_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          field_name: string
          id: string
          new_value: string | null
          non_conformance_id: string
          old_value: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          field_name: string
          id?: string
          new_value?: string | null
          non_conformance_id: string
          old_value?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          field_name?: string
          id?: string
          new_value?: string | null
          non_conformance_id?: string
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "non_conformance_history_non_conformance_id_fkey"
            columns: ["non_conformance_id"]
            isOneToOne: false
            referencedRelation: "non_conformances"
            referencedColumns: ["id"]
          },
        ]
      }
      non_conformances: {
        Row: {
          action_verification_date: string | null
          auditor_name: string
          code: string | null
          completion_date: string | null
          created_at: string
          created_by: string | null
          department_id: string
          description: string
          effectiveness_verification_date: string | null
          id: string
          immediate_actions: string | null
          location: string | null
          occurrence_date: string
          response_date: string | null
          responsible_name: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          action_verification_date?: string | null
          auditor_name: string
          code?: string | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          department_id: string
          description: string
          effectiveness_verification_date?: string | null
          id?: string
          immediate_actions?: string | null
          location?: string | null
          occurrence_date: string
          response_date?: string | null
          responsible_name: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          action_verification_date?: string | null
          auditor_name?: string
          code?: string | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string
          description?: string
          effectiveness_verification_date?: string | null
          id?: string
          immediate_actions?: string | null
          location?: string | null
          occurrence_date?: string
          response_date?: string | null
          responsible_name?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "non_conformances_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_audits: {
        Row: {
          created_at: string
          department_id: string
          id: string
          notes: string | null
          responsible_auditor: string
          status: string
          updated_at: string
          week_number: number
          year: number
        }
        Insert: {
          created_at?: string
          department_id: string
          id?: string
          notes?: string | null
          responsible_auditor: string
          status?: string
          updated_at?: string
          week_number: number
          year: number
        }
        Update: {
          created_at?: string
          department_id?: string
          id?: string
          notes?: string | null
          responsible_auditor?: string
          status?: string
          updated_at?: string
          week_number?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_audits_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          createdat: string
          darkmode: boolean
          emailnotifications: boolean
          id: string
          systemnotifications: boolean
          updatedat: string
          userid: string
        }
        Insert: {
          createdat?: string
          darkmode?: boolean
          emailnotifications?: boolean
          id?: string
          systemnotifications?: boolean
          updatedat?: string
          userid: string
        }
        Update: {
          createdat?: string
          darkmode?: boolean
          emailnotifications?: boolean
          id?: string
          systemnotifications?: boolean
          updatedat?: string
          userid?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      department_group: "corporate" | "regional"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      department_group: ["corporate", "regional"],
    },
  },
} as const
