/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import type { Atom, Bond } from "@entities";
import { EditorHandler } from "@features/editor/EditorHandler";
import type { NamedPoint } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { MouseEventCallBackProperties } from "@src/types";

import { ActiveToolbarItem, LaunchAttrs, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { BoxSelect } from "./SelectTemplate";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class EraseBox extends BoxSelect {
    selectColor: string = "#ff9a9a";

    shapeFillColor: string = "#df5c83";
    // delete all selectedAtoms

    onActivate(attrs?: LaunchAttrs) {
        if (!attrs) return;
        const { editor } = attrs;
        if (!editor) {
            throw new Error("EraseBox.onActivate: missing attributes or editor");
        }
        this.doAction(editor);
        editor.setHoverMode(true, true, true, this.selectColor);
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties): void {
        if (this.selectionMode === 1) return;
        super.onMouseMove(eventHolder);
    }

    doAction(editor: EditorHandler): void {
        let changed = 0;
        changed += editor.applyFunctionToAtoms((atom: Atom) => {
            atom.destroy();
        }, true);
        changed += editor.applyFunctionToBonds((bond: Bond) => {
            bond.destroy();
        }, true);
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
        if (changed > 0) editor.createHistoryUpdate();
        editor.setHoverMode(true, true, true, this.selectColor);
    }
}

const eraseBoxTool = new EraseBox();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Erase, eraseBoxTool);

const eraseBox = new SimpleToolbarItemButtonBuilder("Erase Box", ToolsConstants.ToolsNames.Erase, ["B"]);

RegisterToolbarButtonWithName(eraseBox);

export default eraseBox;
