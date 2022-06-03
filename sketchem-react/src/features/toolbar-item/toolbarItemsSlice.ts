import { AtomConstants } from "@constants/atom.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { drawMolFromFile } from "@features/chemistry/kekuleHandler";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    FrequentAtoms,
    isIAtomAttributes,
    LoadFileAction,
    SaveFileAction,
    ToolbarAction,
    ToolbarItemState,
} from "@types";

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

const initialToolbarAction = {
    button: "",
} as ToolbarAction;

const initialState = {
    toolbarContext: initialToolbarAction,
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
    name: "tool_bar_item",
    initialState,
    reducers: {
        tool_change: (state: ToolbarItemState, action: PayloadAction<ToolbarAction>) => {
            state.toolbarContext = action.payload;
            state.dialogWindow = "";

            const payloadAttributes = action.payload.attributes;
            if (payloadAttributes && isIAtomAttributes(payloadAttributes)) {
                const newFrequentAtoms = createFrequentAtoms(state.frequentAtoms, payloadAttributes.label);
                state.frequentAtoms = newFrequentAtoms;
            }
            // state.user = action.payload;
            // localStorage.setItem('user', JSON.stringify(action.payload))
        },
        reset_tool: (state: ToolbarItemState) => {
            state.toolbarContext.button = "";
            state.toolbarContext.attributes = undefined;
            state.dialogWindow = "";
        },
        dialog: (state: ToolbarItemState, action: PayloadAction<string>) => {
            state.dialogWindow = action.payload;
        },
        // add_frequent_atom: (state: ToolbarItemState, action: PayloadAction<string>) => {
        //     const newFrequentAtoms = createFrequentAtoms(state.frequentAtoms, action.payload);
        //     state.frequentAtoms = newFrequentAtoms;
        // },
        save_file: (state: ToolbarItemState, action: PayloadAction<SaveFileAction>) => {
            state.exportContext = action.payload;
        },
    },
    // extraReducers: (builder) => {

    //     // When we send a request,
    //     // `fetchTodos.pending` is being fired:
    //     builder.addCase(fetchTodos.pending, (state) => {
    //       // At that moment,
    //       // we change status to `loading`
    //       // and clear all the previous errors:
    //       state.status = "loading";
    //       state.error = null;
    //     });

    //     // When a server responses with the data,
    //     // `fetchTodos.fulfilled` is fired:
    //     builder.addCase(fetchTodos.fulfilled,
    //       (state, { payload }) => {
    //       // We add all the new todos into the state
    //       // and change `status` back to `idle`:
    //       state.list.push(...payload);
    //       state.status = "idle";
    //     });
    //   },
});

const loadFile = createAsyncThunk<void, LoadFileAction>("load_file", async (fileContext: LoadFileAction) => {
    drawMolFromFile(fileContext);
});

// eslint-disable-next-line no-unused-vars
const clearCanvas = createAsyncThunk<void>("clear_canvas", async (_, thunkApi) => {
    thunkApi.dispatch(
        slice.actions.tool_change({
            button: ToolsConstants.ToolsNames.SelectBox,
        })
    );
});

export const actions = { ...slice.actions, loadFile, clearCanvas };
export default slice.reducer;
