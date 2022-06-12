/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import type { Atom, Bond } from "@entities";
import { EditorHandler } from "@features/editor/EditorHandler";
import type { NamedPoint } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { BoxSelect } from "./SelectTemplate";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class EraseBox extends BoxSelect {
    selectColor: string = "#ff9a9a";

    shapeFillColor: string = "#df5c83";
    // delete all selectedAtoms

    onActivate(_: any, editor: EditorHandler): void {
        this.doAction(editor);
        editor.setHoverMode(true, true, true, this.selectColor);
    }

    doAction(editor: EditorHandler): void {
        editor.applyFunctionToAtoms((atom: Atom) => {
            atom.destroy();
        }, true);
        editor.applyFunctionToBonds((bond: Bond) => {
            bond.destroy();
        }, true);
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
        editor.setHoverMode(true, true, true, this.selectColor);
    }
}

const eraseBoxTool = new EraseBox();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Erase, eraseBoxTool);

const eraseBox = new SimpleToolbarItemButtonBuilder("Erase Box", ToolsConstants.ToolsNames.Erase, ["B"]);

RegisterToolbarButtonWithName(eraseBox);

export { eraseBox };
