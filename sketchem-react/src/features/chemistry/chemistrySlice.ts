import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionItem, ChemistryState } from "@types";

const initialState = { items: undefined } as ChemistryState;
const slice = createSlice({
    name: "chemistry",
    initialState,
    reducers: {
        press: (state, action: PayloadAction<ActionItem[]>) => {
            state.items = action.payload;
        },
    },
});

export const actions = { ...slice.actions };
export default slice.reducer;
