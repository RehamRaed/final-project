export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }

      course_tags: {
        Row: {
          id: string
          course_id: string | null
          tag_id: string | null
        }
        Insert: {
          id?: string
          course_id?: string | null
          tag_id?: string | null
        }
        Update: {
          id?: string
          course_id?: string | null
          tag_id?: string | null
        }
        Relationships: [
          { foreignKeyName: "course_tags_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] },
          { foreignKeyName: "course_tags_tag_id_fkey"; columns: ["tag_id"]; isOneToOne: false; referencedRelation: "tags"; referencedColumns: ["id"] }
        ]
      }

      courses: {
        Row: {
          id: string
          category_id: string | null
          title: string
          description: string | null
          summary: string | null
          icon: string | null
          thumbnail_url: string | null
          estimated_hours: number | null
          instructor: string | null
          language: string | null
          level: string | null
          rating: number | null
          xp_reward: number | null
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          description?: string | null
          summary?: string | null
          icon?: string | null
          thumbnail_url?: string | null
          estimated_hours?: number | null
          instructor?: string | null
          language?: string | null
          level?: string | null
          rating?: number | null
          xp_reward?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          description?: string | null
          summary?: string | null
          icon?: string | null
          thumbnail_url?: string | null
          estimated_hours?: number | null
          instructor?: string | null
          language?: string | null
          level?: string | null
          rating?: number | null
          xp_reward?: number | null
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "courses_category_id_fkey"; columns: ["category_id"]; isOneToOne: false; referencedRelation: "categories"; referencedColumns: ["id"] }
        ]
      }

      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          order_index: number
          content: string | null
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          order_index?: number
          content?: string | null
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          order_index?: number
          content?: string | null
        }
        Relationships: [
          { foreignKeyName: "lessons_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] }
        ]
      }

      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          avatar_url: string | null
          bio: string | null
          badges: string[] | null
          student_id: string | null
          university_id: string | null
          current_roadmap_id: string | null
          current_semester: number | null
          department: string | null
          level: number | null
          tawjihi_year: number | null
          tawjihi_average: number | null
          telegram_user_id: number | null
          xp: number | null
          social_links: Json | null
          last_active: string
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          avatar_url?: string | null
          bio?: string | null
          badges?: string[] | null
          student_id?: string | null
          university_id?: string | null
          current_roadmap_id?: string | null
          current_semester?: number | null
          department?: string | null
          level?: number | null
          tawjihi_year?: number | null
          tawjihi_average?: number | null
          telegram_user_id?: number | null
          xp?: number | null
          social_links?: Json | null
          last_active?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          avatar_url?: string | null
          bio?: string | null
          badges?: string[] | null
          student_id?: string | null
          university_id?: string | null
          current_roadmap_id?: string | null
          current_semester?: number | null
          department?: string | null
          level?: number | null
          tawjihi_year?: number | null
          tawjihi_average?: number | null
          telegram_user_id?: number | null
          xp?: number | null
          social_links?: Json | null
          last_active?: string
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "profiles_current_roadmap_id_fkey"; columns: ["current_roadmap_id"]; isOneToOne: false; referencedRelation: "roadmaps"; referencedColumns: ["id"] }
        ]
      }

      roadmaps: {
        Row: {
          id: string
          title: string
          description: string | null
          icon: string | null
          color: string | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          icon?: string | null
          color?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Relationships: []
      }

      roadmap_courses: {
        Row: {
          id: string
          roadmap_id: string | null
          course_id: string | null
          order_index: number | null
        }
        Insert: {
          id?: string
          roadmap_id?: string | null
          course_id?: string | null
          order_index?: number | null
        }
        Update: {
          id?: string
          roadmap_id?: string | null
          course_id?: string | null
          order_index?: number | null
        }
        Relationships: [
          { foreignKeyName: "roadmap_courses_roadmap_id_fkey"; columns: ["roadmap_id"]; isOneToOne: false; referencedRelation: "roadmaps"; referencedColumns: ["id"] },
          { foreignKeyName: "roadmap_courses_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] }
        ]
      }

      tags: {
        Row: { id: string; name: string; created_at: string }
        Insert: { id?: string; name: string; created_at?: string }
        Update: { id?: string; name?: string; created_at?: string }
        Relationships: []
      }

      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string | null
          priority: string | null
          subject_id: string | null
          user_id: string
          due_date: string | null
          completed_at: string | null
          created_at: string
          is_completed: boolean | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: string | null
          priority?: string | null
          subject_id?: string | null
          user_id: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          is_completed?: boolean | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          subject_id?: string | null
          user_id?: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          is_completed?: boolean | null
        }
        Relationships: [
          { foreignKeyName: "tasks_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "tasks_subject_id_fkey"; columns: ["subject_id"]; isOneToOne: false; referencedRelation: "university_subjects"; referencedColumns: ["id"] }
        ]
      }

      subject_enrollments: {
        Row: {
          id: string
          student_id: string
          subject_id: string
          semester: string
          status: string | null
          grade: number | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          subject_id: string
          semester: string
          status?: string | null
          grade?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          subject_id?: string
          semester?: string
          status?: string | null
          grade?: number | null
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "subject_enrollments_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "subject_enrollments_subject_id_fkey"; columns: ["subject_id"]; isOneToOne: false; referencedRelation: "university_subjects"; referencedColumns: ["id"] }
        ]
      }

      subject_resources: {
        Row: {
          id: string
          subject_id: string | null
          parent_id: string | null
          uploader_id: string | null
          title: string
          description: string | null
          type: string
          category: string | null
          file_url: string | null
          file_size: number | null
          file_extension: string | null
          mime_type: string | null
          telegram_file_id: string | null
          downloads: number | null
          is_pinned: boolean | null
          upvotes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          subject_id?: string | null
          parent_id?: string | null
          uploader_id?: string | null
          title: string
          description?: string | null
          type: string
          category?: string | null
          file_url?: string | null
          file_size?: number | null
          file_extension?: string | null
          mime_type?: string | null
          telegram_file_id?: string | null
          downloads?: number | null
          is_pinned?: boolean | null
          upvotes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string | null
          parent_id?: string | null
          uploader_id?: string | null
          title?: string
          description?: string | null
          type?: string
          category?: string | null
          file_url?: string | null
          file_size?: number | null
          file_extension?: string | null
          mime_type?: string | null
          telegram_file_id?: string | null
          downloads?: number | null
          is_pinned?: boolean | null
          upvotes?: number | null
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "subject_resources_subject_id_fkey"; columns: ["subject_id"]; isOneToOne: false; referencedRelation: "university_subjects"; referencedColumns: ["id"] },
          { foreignKeyName: "subject_resources_parent_id_fkey"; columns: ["parent_id"]; isOneToOne: false; referencedRelation: "subject_resources"; referencedColumns: ["id"] },
          { foreignKeyName: "subject_resources_uploader_id_fkey"; columns: ["uploader_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ]
      }

      university_subjects: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          department: string
          semester: string
          credits: number | null
          instructor: string | null
          university_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          department: string
          semester: string
          credits?: number | null
          instructor?: string | null
          university_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          department?: string
          semester?: string
          credits?: number | null
          instructor?: string | null
          university_id?: string
          created_at?: string
        }
        Relationships: []
      }

      user_course_progress: {
        Row: {
          id: string
          user_id: string | null
          course_id: string | null
          status: string | null
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          status?: string | null
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          status?: string | null
          started_at?: string
          completed_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "user_course_progress_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "user_course_progress_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] }
        ]
      }

      user_lesson_progress: {
        Row: {
          id: string
          user_id: string | null
          lesson_id: string | null
          status: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          lesson_id?: string | null
          status?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          lesson_id?: string | null
          status?: string | null
          completed_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "user_lesson_progress_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "user_lesson_progress_lesson_id_fkey"; columns: ["lesson_id"]; isOneToOne: false; referencedRelation: "lessons"; referencedColumns: ["id"] }
        ]
      }
    }

    Views: {}
    Functions: {
      increment_xp: {
        Args: {
          user_id_input: string
          xp_amount: number
        }
        Returns: {
          new_xp: number
          new_level: number
        }[]
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}

export type Tables<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Row"]

export type TablesInsert<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Insert"]

export type TablesUpdate<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Update"]
