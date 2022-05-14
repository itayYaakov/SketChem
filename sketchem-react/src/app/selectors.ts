import { RootState } from "@types";

export const getToolbarItem = (state: RootState) => state.toolbarItem;
export const getFileContent = (state: RootState) => state.toolbarItem.fileContent;
export const getMoleculeCommands = (state: RootState) => state.chemistry.items;
