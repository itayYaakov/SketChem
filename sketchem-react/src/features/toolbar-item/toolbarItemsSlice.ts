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
    toolName: "",
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
            state.toolbarContext.toolName = "";
            state.toolbarContext.attributes = undefined;
            state.dialogWindow = "";
        },
        dialog: (state: ToolbarItemState, action: PayloadAction<string>) => {
            state.dialogWindow = action.payload;
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
        // slice.actions.tool_change({
        //     toolName: ToolsConstants.ToolsNames.SelectBox,
        // })
        slice.actions.tool_change({
            toolName: ToolsConstants.ToolsNames.Charge,
            subToolName: ToolsConstants.SubToolsNames.ChargeMinus,
            attributes: { charge: -1 },
        })
    );
});

export const actions = { ...slice.actions, loadFile, clearCanvas, exportToFile };
export default slice.reducer;
