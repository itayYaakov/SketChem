import { store } from "@app/store";
import * as ToolsConstants from "@constants/tools.constants";
import { ToolbarAction } from "@src/types";
import { ActionCreators } from "redux-undo";

import { ActiveToolbarItem, LaunchAttrs, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class Unredo implements ActiveToolbarItem {
    private forward: boolean;

    constructor(forward: boolean) {
        this.forward = forward;
    }

    shouldIRestorePreviousTool(previousToolContext: ToolbarAction): boolean {
        switch (previousToolContext.toolName) {
            case ToolsConstants.ToolsNames.Clear:
            case ToolsConstants.ToolsNames.Copy:
            case ToolsConstants.ToolsNames.Empty:
            case ToolsConstants.ToolsNames.Export:
            case ToolsConstants.ToolsNames.Import:
            case ToolsConstants.ToolsNames.Paste:
            case ToolsConstants.ToolsNames.PeriodicTable:
            case ToolsConstants.ToolsNames.Redo:
            case ToolsConstants.ToolsNames.Undo:
                return false;
            default:
                return true;
        }
    }

    onActivate(attrs?: LaunchAttrs) {
        if (!attrs) return;
        const { editor, previousToolContext } = attrs;
        if (!editor) {
            throw new Error("Copy.onActivate: missing attributes or editor");
        }
        if (this.forward) {
            store.dispatch(ActionCreators.redo());
        } else {
            store.dispatch(ActionCreators.undo());
        }

        if (previousToolContext && this.shouldIRestorePreviousTool(previousToolContext)) {
            store.dispatch(actions.asyncDispatchTool(previousToolContext));
        } else {
            store.dispatch(actions.asyncDispatchNone());
        }
    }
}

const undoTool = new Unredo(false);
const redoTool = new Unredo(true);
RegisterToolbarWithName(ToolsConstants.ToolsNames.Undo, undoTool);
RegisterToolbarWithName(ToolsConstants.ToolsNames.Redo, redoTool);

const undo = new SimpleToolbarItemButtonBuilder(
    "Undo",
    ToolsConstants.ToolsNames.Undo,
    ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.ToolsNames.Undo)
);
const redo = new SimpleToolbarItemButtonBuilder(
    "Redo",
    ToolsConstants.ToolsNames.Redo,
    ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.ToolsNames.Redo)
);

RegisterToolbarButtonWithName(undo);
RegisterToolbarButtonWithName(redo);

export { redo, undo };
