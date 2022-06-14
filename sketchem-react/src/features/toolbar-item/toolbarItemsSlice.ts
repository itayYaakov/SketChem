import { AtomConstants } from "@constants/atom.constants";
import * as ToolsConstants from "@constants/tools.constants";
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
import { exportFileFromMolecule } from "@utils/KekuleUtils";

const initialLoadFileAction: LoadFileAction = {
    content: "",
    format: "",
    replace: false,
};

const initialSaveFileAction: SaveFileAction = {
    format: "",
};

const initialFrequentAtoms: FrequentAtoms = {
    atoms: AtomConstants.DefaultAtomsLabel,
    currentAtom: "",
};

const initialToolbarAction: ToolbarAction = {
    toolName: "",
};

const initialState: ToolbarItemState = {
    toolbarContext: initialToolbarAction,
    dialogWindow: "",
    importContext: initialLoadFileAction,
    exportContext: initialSaveFileAction,
    frequentAtoms: initialFrequentAtoms,
};

function createFrequentAtoms(frequentAtoms: FrequentAtoms, newAtom: string) {
    const frequentAtomsList = [...frequentAtoms.atoms];

    if (frequentAtomsList.length >= AtomConstants.MaxAtomsListSize) {
        frequentAtomsList.pop();
    }

    if (!frequentAtomsList.includes(newAtom)) frequentAtomsList.unshift(newAtom);

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
            state.toolbarContext = { ...initialToolbarAction };
            state.dialogWindow = "";
        },
        dialog: (state: ToolbarItemState, action: PayloadAction<string>) => {
            state.dialogWindow = action.payload;
            state.toolbarContext = { ...initialToolbarAction };
            state.toolbarContext.toolName = action.payload;
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

const exportToFile = createAsyncThunk<void, SaveFileAction>("export_to_file", async (saveAction: SaveFileAction) => {
    const file = exportFileFromMolecule(saveAction.format);
    console.log("file content:");
    console.log(file);
    return;
    // convert string to blob with mime type and download it
    const blob = new Blob([file], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "file.txt";
    link.click();
    window.URL.revokeObjectURL(url);
});

// eslint-disable-next-line no-unused-vars
const clearCanvas = createAsyncThunk<void>("clear_canvas", async (_, thunkApi) => {
    thunkApi.dispatch(
        slice.actions.tool_change({
            toolName: ToolsConstants.ToolsNames.SelectBox,
        })
    );
});

const asyncDispatchTool = createAsyncThunk<void, ToolbarAction>("set_selection_tool", async (action, thunkApi) => {
    console.log("Async dispatch tool");
    console.table(action);
    thunkApi.dispatch(slice.actions.tool_change(action));
});

const asyncDispatchSelect = createAsyncThunk<void>("set_selection_tool", async (_, thunkApi) => {
    thunkApi.dispatch(
        slice.actions.tool_change({
            toolName: ToolsConstants.ToolsNames.SelectBox,
        })
    );
});

export const actions = {
    ...slice.actions,
    loadFile,
    clearCanvas,
    asyncDispatchTool,
    asyncDispatchSelect,
    exportToFile,
};
export default slice.reducer;
