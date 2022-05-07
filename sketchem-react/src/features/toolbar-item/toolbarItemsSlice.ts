import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToolbarItemState } from "@types";

const initialState = { selectedToolbarItem: "", dialogWindow: "" } as ToolbarItemState;

const slice = createSlice({
    name: "toolbar-item",
    initialState,
    reducers: {
        press: (state, action: PayloadAction<string>) => {
            state.selectedToolbarItem = action.payload;
            state.dialogWindow = "";
            // state.user = action.payload;
            // localStorage.setItem('user', JSON.stringify(action.payload))
        },
        dialog: (state, action: PayloadAction<string>) => {
            state.dialogWindow = action.payload;
        },
    },
});

export const actions = { ...slice.actions };
export default slice.reducer;
