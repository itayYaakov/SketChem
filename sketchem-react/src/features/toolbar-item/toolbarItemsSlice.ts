import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadFileAction, SaveFileAction, ToolbarItemState } from "@types";

const initialLoadFileAction = {
    content: "",
    format: "",
    replace: false,
} as LoadFileAction;

const initialSaveFileAction = {
    format: "",
    isWaiting: false,
    response: "",
} as SaveFileAction;

const initialState = {
    selectedToolbarItem: "",
    dialogWindow: "",
    importContext: initialLoadFileAction,
    exportContext: initialSaveFileAction,
} as ToolbarItemState;

const slice = createSlice({
    name: "toolbarItem",
    initialState,
    reducers: {
        press: (state: ToolbarItemState, action: PayloadAction<string>) => {
            state.selectedToolbarItem = action.payload;
            state.dialogWindow = "";
            // state.user = action.payload;
            // localStorage.setItem('user', JSON.stringify(action.payload))
        },
        dialog: (state: ToolbarItemState, action: PayloadAction<string>) => {
            state.dialogWindow = action.payload;
        },
        load_file: (state: ToolbarItemState, action: PayloadAction<LoadFileAction>) => {
            state.importContext = action.payload;
        },
        save_file: (state: ToolbarItemState, action: PayloadAction<SaveFileAction>) => {
            state.exportContext = action.payload;
        },
    },
});

export const actions = { ...slice.actions };
export default slice.reducer;
