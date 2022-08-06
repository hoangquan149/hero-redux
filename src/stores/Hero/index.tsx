import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { StorageService } from "../../services/StorageService";
import Hero from "../../types/Hero";

interface HeroState {
   heros: Array<Hero>;
}

const initialState = {
   heros: StorageService.get(),
} as HeroState;

const heroSlice = createSlice({
   name: "hero",
   initialState,
   reducers: {
      add(state, action: PayloadAction<Hero>) {
         state.heros.unshift(action.payload);
         StorageService.save(state.heros);
      },
      save(state, action) {
         state.heros = action.payload;
      },
   },
});

export const { add, save } = heroSlice.actions;

export default heroSlice.reducer;
