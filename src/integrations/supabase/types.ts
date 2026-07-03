export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_action_logs: {
        Row: {
          action_details: Json | null
          action_type: string
          admin_user_id: string
          created_at: string
          id: string
          target_user_id: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          admin_user_id: string
          created_at?: string
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      admin_metrics: {
        Row: {
          churn_rate: number | null
          content_generated: number | null
          created_at: string
          date: string
          enterprise_users: number | null
          free_users: number | null
          id: string
          mrr: number | null
          pro_users: number | null
          total_users: number | null
          trial_conversions: number | null
          updated_at: string
        }
        Insert: {
          churn_rate?: number | null
          content_generated?: number | null
          created_at?: string
          date: string
          enterprise_users?: number | null
          free_users?: number | null
          id?: string
          mrr?: number | null
          pro_users?: number | null
          total_users?: number | null
          trial_conversions?: number | null
          updated_at?: string
        }
        Update: {
          churn_rate?: number | null
          content_generated?: number | null
          created_at?: string
          date?: string
          enterprise_users?: number | null
          free_users?: number | null
          id?: string
          mrr?: number | null
          pro_users?: number | null
          total_users?: number | null
          trial_conversions?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          platform: string
          published_at: string | null
          scheduled_at: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
          webhook_sent: boolean | null
          webhook_sent_at: string | null
        }
        Insert: {
          content: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          platform: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
          webhook_sent?: boolean | null
          webhook_sent_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          platform?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          webhook_sent?: boolean | null
          webhook_sent_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_segment: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          instagram_link: string | null
          phone: string | null
          profile_image: string | null
          updated_at: string
        }
        Insert: {
          business_segment?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          instagram_link?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
        }
        Update: {
          business_segment?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          instagram_link?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          platform: string
          platform_user_id: string
          refresh_token: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          platform_user_id: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          platform_user_id?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      social_metrics: {
        Row: {
          clicks: number | null
          collected_at: string
          comments: number | null
          created_at: string
          id: string
          impressions: number | null
          likes: number | null
          platform: string
          platform_post_id: string | null
          post_id: string
          shares: number | null
        }
        Insert: {
          clicks?: number | null
          collected_at?: string
          comments?: number | null
          created_at?: string
          id?: string
          impressions?: number | null
          likes?: number | null
          platform: string
          platform_post_id?: string | null
          post_id: string
          shares?: number | null
        }
        Update: {
          clicks?: number | null
          collected_at?: string
          comments?: number | null
          created_at?: string
          id?: string
          impressions?: number | null
          likes?: number | null
          platform?: string
          platform_post_id?: string | null
          post_id?: string
          shares?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "social_metrics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_stats: {
        Row: {
          ai_requests: number | null
          created_at: string
          date: string
          id: string
          posts_generated: number | null
          posts_scheduled: number | null
          social_accounts_connected: number | null
          user_id: string
        }
        Insert: {
          ai_requests?: number | null
          created_at?: string
          date: string
          id?: string
          posts_generated?: number | null
          posts_scheduled?: number | null
          social_accounts_connected?: number | null
          user_id: string
        }
        Update: {
          ai_requests?: number | null
          created_at?: string
          date?: string
          id?: string
          posts_generated?: number | null
          posts_scheduled?: number | null
          social_accounts_connected?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          ai_requests_limit: number
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          plan_type: string
          posts_limit: number
          social_accounts_limit: number
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_requests_limit?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          plan_type?: string
          posts_limit?: number
          social_accounts_limit?: number
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_requests_limit?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          plan_type?: string
          posts_limit?: number
          social_accounts_limit?: number
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          data: Json
          error_message: string | null
          event_type: string
          id: string
          processed_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data: Json
          error_message?: string | null
          event_type: string
          id?: string
          processed_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          error_message?: string | null
          event_type?: string
          id?: string
          processed_at?: string | null
          status?: string | null
          user_id?: string | null
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
      app_role: "admin" | "user" | "service"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "service"],
    },
  },
} as const
