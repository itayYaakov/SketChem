import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { ChemistryState } from "@types";
import hash from "object-hash";
import undoable from "redux-undo";

const initialState = {} as any as ChemistryState;

function shouldUpdate(oldState: ChemistryState, currentState: ChemistryState) {
    if (oldState?.atoms?.length !== currentState?.atoms?.length) return true;
    if (oldState?.bonds?.length !== currentState?.bonds?.length) return true;
    return hash(current(oldState)) !== hash(currentState);
}

const slice = createSlice({
    name: "chemistry",
    initialState,
    reducers: {
        update_history_state: (state: ChemistryState, action: PayloadAction<ChemistryState>) => {
            if (!shouldUpdate(state, action.payload)) return;
            console.log("update_history_state");
            state.atoms = action.payload.atoms;
            state.bonds = action.payload.bonds;
        },
    },
});

export const actions = { ...slice.actions };
export default undoable(slice.reducer, {
    limit: 20,
    // undoType: "CHEMISTRY_UNDO", // define a custom action type for this undo action
    // redoType: "CHEMISTRY_REDO", // define a custom action type for this redo action
    // clearHistoryType: "CLEAR_CHEMISTRY_HISTORY", // [beta only] define custom action type for this clearHistory action
});
