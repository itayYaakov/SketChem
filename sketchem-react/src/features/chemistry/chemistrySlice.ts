import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionItem, ChemistryState } from "@types";

const initialState = { items: [] } as ChemistryState;

const slice = createSlice({
    name: "chemistry",
    initialState,
    reducers: {
        update_history: (state: ChemistryState, action: PayloadAction<ActionItem[]>) => {
            state.items.push(action.payload);
        },
    },
});

export const actions = { ...slice.actions };
export default slice.reducer;
