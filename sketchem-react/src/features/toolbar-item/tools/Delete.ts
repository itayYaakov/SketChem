/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import type { Atom, Bond } from "@entities";
import type { NamedPoint } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { BoxSelect } from "./SelectTemplate";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class DeleteBox extends BoxSelect {
    // delete all selectedAtoms

    onActivate(): void {
        this.doAction();
    }

    doAction(): void {
        const selectedBonds = this.getSelectedBonds();
        const selectedAtoms = this.getSelectedAtoms();

        selectedAtoms.forEach((atom, id) => {
            atom.destroy();
        });
        selectedBonds.forEach((bond, id) => {
            bond.destroy();
        });

        this.resetSelection();
    }
}

const deleteBoxTool = new DeleteBox();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Erase, deleteBoxTool);

const deleteBox = new SimpleToolbarItemButtonBuilder("Erase Box", ToolsConstants.ToolsNames.Erase, ["B"]);

export { deleteBox };
