import { supabase } from './supabase/client';
import { Tables } from '@/types/database.types';

export interface CourseFilter {
  query?: string;
  tags?: string[];
  roadmapId?: string;
}

export interface CourseSearchResult extends Tables<'courses'> {
  course_tags?: Tables<'course_tags'>[];
}

export async function fetchCourses(filter: CourseFilter): Promise<CourseSearchResult[]> {
  let query = supabase.from('courses').select(`
    *,
    course_tags(
      id,
      tag_id
    )
  `);

  if (filter.query) {
    query = query.ilike('title', `%${filter.query}%`);
  }

  if (filter.roadmapId) {
    query = query
      .select(`
        *,
        course_tags(
          id,
          tag_id
        ),
        roadmap_courses!inner(
          roadmap_id
        )
      `)
      .eq('roadmap_courses.roadmap_id', filter.roadmapId);
  }

  if (filter.tags && filter.tags.length > 0) {
    query = query
      .select(`
        *,
        course_tags!inner(
          id,
          tag_id
        )
      `)
      .in('course_tags.tag_id', filter.tags);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Search error:', error);
    throw new Error(`Failed to search courses: ${error.message}`);
  }

  return data as unknown as CourseSearchResult[] || [];
}
