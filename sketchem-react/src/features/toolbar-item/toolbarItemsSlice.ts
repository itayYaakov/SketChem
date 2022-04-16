import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IToolbarItemsProps } from "./ToolbarItems";
import type ToolbarItem from "./ToolbarItem";
import b from "./bottom-toolbar-item/ToolbarItem";
import l from "./left-toolbar-item/ToolbarItem";
import r from "./right-toolbar-item/ToolbarItem";
import t from "./top-toolbar-item/ToolbarItem";

const toolbarItemsList: ToolbarItem[] = [
    ...b.toolbarItemsList,
    ...l.toolbarItemsList,
    ...r.toolbarItemsList,
    ...t.toolbarItemsList,
];
const toolbarItemsDict = Object.assign({}, ...toolbarItemsList.map((x: ToolbarItem) => ({ [x.name]: x })));

const initialState = null;

const slice = createSlice({
    name: "toolbar-item",
    initialState: {
        user: initialState,
    },
    reducers: {
        press: (state, action: PayloadAction<string>) => {
            const item: ToolbarItem = toolbarItemsDict[action.payload];
            console.log(`${item.name} was pressed with ${item.keyboardKeys}`);
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
