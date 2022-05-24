import { RootState } from "@types";

export const getToolbarItem = (state: RootState) => state.toolbarItem;
export const getFileContent = (state: RootState) => state.toolbarItem.importContext.content;
export const getMoleculeCommands = (state: RootState) => state.chemistry.items;
