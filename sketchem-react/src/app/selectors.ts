import { RootState } from "@types";

export const getToolbarItemContext = (state: RootState) => state.toolbarItem.toolbarContext;
export const getToolbarDialog = (state: RootState) => state.toolbarItem.dialogWindow;
export const getFileContent = (state: RootState) => state.toolbarItem.importContext;
export const getMoleculeCommands = (state: RootState) => state.chemistry.items;
