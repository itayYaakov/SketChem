import { RootState } from "@types";

export const getToolbarFrequentAtoms = (state: RootState) => state.toolbarItem.frequentAtoms;
export const getToolbarItemContext = (state: RootState) => state.toolbarItem.toolbarContext;
export const getToolbarDialog = (state: RootState) => state.toolbarItem.dialogWindow;
export const getFileContent = (state: RootState) => state.toolbarItem.importContext;
export const getChemistryDataPresent = (state: RootState) => state.chemistry.present;
export const getChemistryDataIndex = (state: RootState) => state.chemistry.index;
export const isChemistryUndoEnabled = (state: RootState) => state.chemistry.past.length > 0;
export const isChemistryRedoEnabled = (state: RootState) => state.chemistry.future.length > 0;
export const ChemistryFutureLength = (state: RootState) => state.chemistry.future.length;
// export const isChemistryStateOlder = (state: RootState) => {
//     if (state.chemistry.future.length > 0) {
//         return state.chemistry.present;
//     }
//     return undefined;
// };
