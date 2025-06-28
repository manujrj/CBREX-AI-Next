import { createSlice } from "@reduxjs/toolkit";
import type { MatchingResponse } from "@/types/matching";

export interface ResultState {
  data: MatchingResponse | null;
  formData: {
    jobTitle: string;
    sourcingGuideline: string;
  } | null;
}

const initialState: ResultState = {
  data: null,
  formData: null,
};

export const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    setResult: (state, action) => {
      state.data = action.payload;
    },
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
  },
});

export const { setResult, setFormData } = resultSlice.actions;
export default resultSlice.reducer;
