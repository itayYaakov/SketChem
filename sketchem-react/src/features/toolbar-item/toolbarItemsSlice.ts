import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToolbarItemState } from "@types";

const initialState = { selectedToolbarItem: "", dialogWindow: "", fileContent: "" } as ToolbarItemState;

interface LoadFileAction {
    content: string;
    format: string;
    replace?: boolean;
}
const slice = createSlice({
    name: "toolbarItem",
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
        load_file: (state, action: PayloadAction<LoadFileAction>) => {
            state.fileContent = action.payload.content;
        },
    },
});

export const actions = { ...slice.actions };
export default slice.reducer;
