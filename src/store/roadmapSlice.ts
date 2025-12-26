import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { supabase } from "@/lib/supabase/client"; // Imports client-side Supabase

// Auto-generated Supabase types
// Allows TypeScript to know: Table names and Column types
import { Tables } from "@/types/database.types"; 

export type Roadmap = Tables<'roadmaps'>;

interface RoadmapState {
  current: Roadmap | null;
  loading: boolean;
}
// Initial state for the roadmap slice (no roadmap loaded, not loading)
const initialState: RoadmapState = {
  current: null,
  loading: false,
};

export const fetchCurrentRoadmap = createAsyncThunk<Roadmap | null>(
  "roadmap/fetchCurrent",
  async () => {
    const { data: { user } } = await supabase.auth.getUser(); // check the current session via Supabase Auth
    if (!user) return null; // If no user is found, return null and current roadmap remains null

    // Fetch the user's profile to get the current roadmap ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_roadmap_id")
      .eq("id", user.id)
      .single(); // ensures we get one record only
    // this connects User → Profile → Selected Roadmap

    // if the user hasn’t selected a roadmap yet, return null
    if (!profile?.current_roadmap_id) return null;


    // Fetch the roadmap details using the retrieved roadmap ID
    const { data: roadmap } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("id", profile.current_roadmap_id) // match the ID stored in profile
      .single();

    return roadmap || null;
  }
);

const roadmapSlice = createSlice({
  
  name: "roadmap", // Slice name = "roadmap", this way Redux will store it as: state.roadmap
  initialState, // Initial state defined above
  // Reducers for synchronous actions
  reducers: {
    // update Redux immediately when user selects a new roadmap
    setCurrentRoadmap(state, action: PayloadAction<Roadmap>) {
      state.current = action.payload;
    },
    // clear the current roadmap (on logout or reset)
    clearRoadmap(state) {
      state.current = null;
    },
  },
  // Extra reducers for handling async actions (thunks)
  // Handles the three lifecycle states of fetchCurrentRoadmap.
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(fetchCurrentRoadmap.pending, (state) => {
        state.loading = true; // when fetching starts, UI shows loading
      })
      // Fulfilled
      .addCase(fetchCurrentRoadmap.fulfilled, (state, action) => {
        state.current = action.payload; // set the fetched roadmap or null
        state.loading = false; // stop loading
      })
      // Rejected (if sth went wrong)
      .addCase(fetchCurrentRoadmap.rejected, (state) => {
        state.loading = false; // stop loading on error
        state.current = null; // clear current roadmap on error
      });
  },
});

export const { setCurrentRoadmap, clearRoadmap } = roadmapSlice.actions; // Export synchronous actions for components to use
export default roadmapSlice.reducer; // Export the reducer to be included in the Redux store
