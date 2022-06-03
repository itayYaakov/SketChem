/* eslint-disable @typescript-eslint/no-unused-vars */
import { store } from "@app/store";
import { ToolsConstants } from "@constants/tools.constants";
import { EntitiesMapsStorage } from "@features/shared/storage";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class ClearCanvas implements ActiveToolbarItem {
    onActivate(): void {
        const { atomsMap, bondsMap } = EntitiesMapsStorage;

        bondsMap.forEach((bond) => {
            bond.destroy([], false);
        });

        atomsMap.forEach((atom) => {
            atom.destroy([], false);
        });

        store.dispatch(actions.clearCanvas());

        // !!! need to reset the tool to "" or selection
    }
}

const clearCanvasTool = new ClearCanvas();

RegisterToolbarWithName(ToolsConstants.ToolsNames.Clear, clearCanvasTool);

const clearCanvas = new SimpleToolbarItemButtonBuilder("Clear Canvas", ToolsConstants.ToolsNames.Clear, ["B"]);

export default clearCanvas;
