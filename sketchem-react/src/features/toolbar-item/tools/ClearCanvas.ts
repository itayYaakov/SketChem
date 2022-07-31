/* eslint-disable @typescript-eslint/no-unused-vars */
import { store } from "@app/store";
import * as ToolsConstants from "@constants/tools.constants";

import { ActiveToolbarItem, LaunchAttrs, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class ClearCanvas implements ActiveToolbarItem {
    onActivate(attrs?: LaunchAttrs) {
        if (!attrs) return;
        const { editor } = attrs;
        if (!editor) {
            throw new Error("ClearCanvas.onActivate: missing attributes or editor");
        }
        const changed = editor.clear();
        if (changed) editor.createHistoryUpdate();

        store.dispatch(actions.asyncDispatchSelect());
    }
}

const clearCanvasTool = new ClearCanvas();

RegisterToolbarWithName(ToolsConstants.ToolsNames.Clear, clearCanvasTool);

const clearCanvas = new SimpleToolbarItemButtonBuilder(
    "Clear Canvas",
    ToolsConstants.ToolsNames.Clear,
    ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.ToolsNames.Clear)
);

RegisterToolbarButtonWithName(clearCanvas);

export default clearCanvas;
