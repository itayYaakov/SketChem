import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToolbarItemState } from "@types";

import type ToolbarItem from "./ToolbarItem";
import type { IToolbarItemsProps } from "./ToolbarItems";

const initialState = { selectedToolbarItem: "" } as ToolbarItemState;

const slice = createSlice({
    name: "toolbar-item",
    initialState,
    reducers: {
        press: (state, action: PayloadAction<string>) => {
            console.log(`${action.payload} was pressed`);
            state.selectedToolbarItem = action.payload;
            // state.user = action.payload;
            // localStorage.setItem('user', JSON.stringify(action.payload))
        },
        // logoutSuccess: (state, action) => {
        //     // state.user = null;
        //     // localStorage.removeItem('user')
        // },
    },
});

export const actions = { ...slice.actions };
export default slice.reducer;
