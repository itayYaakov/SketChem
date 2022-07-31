import { store } from "@app/store";
import * as ToolsConstants from "@constants/tools.constants";

import { ActiveToolbarItem, LaunchAttrs, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class Copy implements ActiveToolbarItem {
    onActivate(attrs?: LaunchAttrs) {
        if (!attrs) return;
        const { editor } = attrs;
        if (!editor) {
            throw new Error("Copy.onActivate: missing attributes or editor");
        }

        editor.updateCopiedContents();
        editor.setHoverMode(false, true, true);
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
        store.dispatch(actions.asyncDispatchSelect());
    }
}

const copyTool = new Copy();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Copy, copyTool);

const copy = new SimpleToolbarItemButtonBuilder(
    "Copy",
    ToolsConstants.ToolsNames.Copy,
    ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.ToolsNames.Copy)
);

RegisterToolbarButtonWithName(copy);

export default copy;
