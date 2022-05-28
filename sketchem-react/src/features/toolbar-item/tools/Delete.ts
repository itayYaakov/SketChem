/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType } from "@constants/enum.constants";
import type { Atom, Bond } from "@entities";
import type { NamedPoint } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";

import { ActiveToolbarItem } from "../ToolbarItem";
import { BoxSelect } from "./SelectTemplate";

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

const deleteBox = new DeleteBox("Delete Box", ["A"]);

export { deleteBox };
