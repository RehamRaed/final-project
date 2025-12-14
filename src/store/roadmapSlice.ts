import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase/client";

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface RoadmapState {
  current: Roadmap | null;
  loading: boolean;
}

const initialState: RoadmapState = {
  current: null,
  loading: false,
};

// 🔹 Async thunk لجلب الرودماب الحالية لليوزر
export const fetchCurrentRoadmap = createAsyncThunk<Roadmap | null>(
  "roadmap/fetchCurrent",
  async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("current_roadmap_id")
      .eq("id", user.id)
      .single();

    if (!profile?.current_roadmap_id) return null;

    const { data: roadmap } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("id", profile.current_roadmap_id)
      .single();

    return roadmap || null;
  }
);

// 🔹 Slice
const roadmapSlice = createSlice({
  name: "roadmap",
  initialState,
  reducers: {
    setCurrentRoadmap(state, action: PayloadAction<Roadmap>) {
      state.current = action.payload;
    },
    clearRoadmap(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentRoadmap.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentRoadmap.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentRoadmap.rejected, (state) => {
        state.loading = false;
        state.current = null;
      });
  },
});

export const { setCurrentRoadmap, clearRoadmap } = roadmapSlice.actions;
export default roadmapSlice.reducer;
