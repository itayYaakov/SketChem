/* eslint-disable @typescript-eslint/no-unused-vars */
import { store } from "@app/store";
import * as ToolsConstants from "@constants/tools.constants";
import { EntitiesMapsStorage } from "@features/shared/storage";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class ClearCanvas implements ActiveToolbarItem {
    onActivate(): void {
        const { atomsMap, bondsMap } = EntitiesMapsStorage;

        atomsMap.forEach((atom) => {
            atom.destroy([], false);
        });

        bondsMap.forEach((bond) => {
            bond.destroy([], false);
        });

        store.dispatch(actions.clearCanvas());
    }
}

const clearCanvasTool = new ClearCanvas();

RegisterToolbarWithName(ToolsConstants.ToolsNames.Clear, clearCanvasTool);

const clearCanvas = new SimpleToolbarItemButtonBuilder("Clear Canvas", ToolsConstants.ToolsNames.Clear, ["B"]);

RegisterToolbarButtonWithName(clearCanvas);

export default clearCanvas;
