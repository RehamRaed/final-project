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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      course_tags: {
        Row: {
          course_id: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          course_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          course_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_tags_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          estimated_hours: number | null
          icon: string | null
          id: string
          instructor: string | null
          language: string | null
          level: string | null
          rating: number | null
          thumbnail_url: string | null
          title: string
          xp_reward: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          icon?: string | null
          id?: string
          instructor?: string | null
          language?: string | null
          level?: string | null
          rating?: number | null
          thumbnail_url?: string | null
          title: string
          xp_reward?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          icon?: string | null
          id?: string
          instructor?: string | null
          language?: string | null
          level?: string | null
          rating?: number | null
          thumbnail_url?: string | null
          title?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string | null
          created_at: string
          duration: number | null
          id: string
          is_free: boolean | null
          order_index: number | null
          title: string
          type: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          is_free?: boolean | null
          order_index?: number | null
          title: string
          type?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          is_free?: boolean | null
          order_index?: number | null
          title?: string
          type?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          created_at: string
          current_roadmap_id: string | null
          current_semester: number | null
          department: string | null
          email: string
          full_name: string
          id: string
          last_active: string
          level: number | null
          social_links: Json | null
          student_id: string | null
          tawjihi_average: number | null
          tawjihi_year: number | null
          telegram_user_id: number | null
          university_id: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string
          current_roadmap_id?: string | null
          current_semester?: number | null
          department?: string | null
          email: string
          full_name: string
          id: string
          last_active?: string
          level?: number | null
          social_links?: Json | null
          student_id?: string | null
          tawjihi_average?: number | null
          tawjihi_year?: number | null
          telegram_user_id?: number | null
          university_id?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string
          current_roadmap_id?: string | null
          current_semester?: number | null
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          last_active?: string
          level?: number | null
          social_links?: Json | null
          student_id?: string | null
          tawjihi_average?: number | null
          tawjihi_year?: number | null
          telegram_user_id?: number | null
          university_id?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_roadmap_id_fkey"
            columns: ["current_roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_courses: {
        Row: {
          course_id: string | null
          id: string
          order_index: number | null
          roadmap_id: string | null
        }
        Insert: {
          course_id?: string | null
          id?: string
          order_index?: number | null
          roadmap_id?: string | null
        }
        Update: {
          course_id?: string | null
          id?: string
          order_index?: number | null
          roadmap_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmap_courses_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      subject_enrollments: {
        Row: {
          created_at: string
          grade: number | null
          id: string
          semester: string
          status: string | null
          student_id: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          grade?: number | null
          id?: string
          semester: string
          status?: string | null
          student_id: string
          subject_id: string
        }
        Update: {
          created_at?: string
          grade?: number | null
          id?: string
          semester?: string
          status?: string | null
          student_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subject_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subject_enrollments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "university_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subject_resources: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          downloads: number | null
          file_extension: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_pinned: boolean | null
          mime_type: string | null
          parent_id: string | null
          subject_id: string | null
          telegram_file_id: string | null
          title: string
          type: string
          uploader_id: string | null
          upvotes: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          downloads?: number | null
          file_extension?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_pinned?: boolean | null
          mime_type?: string | null
          parent_id?: string | null
          subject_id?: string | null
          telegram_file_id?: string | null
          title: string
          type: string
          uploader_id?: string | null
          upvotes?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          downloads?: number | null
          file_extension?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_pinned?: boolean | null
          mime_type?: string | null
          parent_id?: string | null
          subject_id?: string | null
          telegram_file_id?: string | null
          title?: string
          type?: string
          uploader_id?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subject_resources_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "subject_resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subject_resources_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "university_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subject_resources_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          priority: string | null
          status: string | null
          subject_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          priority?: string | null
          status?: string | null
          subject_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          priority?: string | null
          status?: string | null
          subject_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "university_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      university_subjects: {
        Row: {
          code: string
          created_at: string
          credits: number | null
          department: string
          description: string | null
          id: string
          instructor: string | null
          name: string
          semester: string
          university_id: string
        }
        Insert: {
          code: string
          created_at?: string
          credits?: number | null
          department: string
          description?: string | null
          id?: string
          instructor?: string | null
          name: string
          semester: string
          university_id: string
        }
        Update: {
          code?: string
          created_at?: string
          credits?: number | null
          department?: string
          description?: string | null
          id?: string
          instructor?: string | null
          name?: string
          semester?: string
          university_id?: string
        }
        Relationships: []
      }
      user_course_progress: {
        Row: {
          completed_at: string | null
          course_id: string | null
          id: string
          started_at: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          id?: string
          started_at?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          id?: string
          started_at?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
