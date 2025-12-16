import { supabase } from './supabase/client';

export interface CourseFilter {
  query?: string;
  tags?: string[];
}

export async function fetchCourses(filter: CourseFilter) {
  let query = supabase.from('courses').select('*, course_tags(*)');

  if (filter.query) {
    query = query.ilike('title', `%${filter.query}%`);
  }

  if (filter.tags && filter.tags.length > 0) {
    query = query.in('course_tag.tag_id', filter.tags);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
