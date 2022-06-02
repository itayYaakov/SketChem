import { AtomConstants } from "@constants/atom.constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FrequentAtoms, LoadFileAction, SaveFileAction, ToolbarAction, ToolbarItemState } from "@types";

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

const initialFrequentAtoms = {
    atoms: AtomConstants.DefaultAtomsLabel,
    currentAtom: "",
} as FrequentAtoms;

const initialState = {
    selectedToolbarItem: "",
    dialogWindow: "",
    importContext: initialLoadFileAction,
    exportContext: initialSaveFileAction,
    frequentAtoms: initialFrequentAtoms,
} as ToolbarItemState;

function createFrequentAtoms(frequentAtoms: FrequentAtoms, newAtom: string) {
    const frequentAtomsList = [...frequentAtoms.atoms];
    if (frequentAtomsList.includes(newAtom)) {
        return frequentAtoms;
    }
    if (frequentAtomsList.length >= AtomConstants.MaxAdditionalAtoms) {
        frequentAtomsList.pop();
    }
    frequentAtomsList.unshift(newAtom);
    return {
        atoms: frequentAtomsList,
        currentAtom: newAtom,
    };
}

const slice = createSlice({
    name: "toolbarItem",
    initialState,
    reducers: {
        tool_change: (state: ToolbarItemState, action: PayloadAction<ToolbarAction>) => {
            state.selectedToolbarItem = action.payload.button;
            state.dialogWindow = "";

            if (action.payload.atomLabel) {
                const newFrequentAtoms = createFrequentAtoms(state.frequentAtoms, action.payload.atomLabel);
                state.frequentAtoms = newFrequentAtoms;
            }
            // state.user = action.payload;
            // localStorage.setItem('user', JSON.stringify(action.payload))
        },
        reset_tool: (state: ToolbarItemState) => {
            state.selectedToolbarItem = "";
            state.dialogWindow = "";
        },
        dialog: (state: ToolbarItemState, action: PayloadAction<string>) => {
            state.dialogWindow = action.payload;
        },
        load_file: (state: ToolbarItemState, action: PayloadAction<LoadFileAction>) => {
            state.importContext = action.payload;
        },
        // add_frequent_atom: (state: ToolbarItemState, action: PayloadAction<string>) => {
        //     const newFrequentAtoms = createFrequentAtoms(state.frequentAtoms, action.payload);
        //     state.frequentAtoms = newFrequentAtoms;
        // },
        save_file: (state: ToolbarItemState, action: PayloadAction<SaveFileAction>) => {
            state.exportContext = action.payload;
        },
    },
});

export const actions = { ...slice.actions };
export default slice.reducer;
