import { store } from "@app/store";
import * as ToolsConstants from "@constants/tools.constants";
import { EditorHandler } from "@features/editor/EditorHandler";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class Copy implements ActiveToolbarItem {
    onActivate(_: any, editor: EditorHandler): void {
        editor.updateCopiedContents();
        editor.setHoverMode(false, true, true);
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
        store.dispatch(actions.asyncDispatchSelect());
    }
}

const copyTool = new Copy();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Copy, copyTool);

const copy = new SimpleToolbarItemButtonBuilder("Copy", ToolsConstants.ToolsNames.Copy, ["B"]);

RegisterToolbarButtonWithName(copy);

export default copy;
