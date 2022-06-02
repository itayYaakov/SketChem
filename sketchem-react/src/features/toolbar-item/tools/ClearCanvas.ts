/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import type { Atom, Bond } from "@entities";
import knn from "@features/shared/rbushKnn";
import type { NamedPoint } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { BoxSelect } from "./SelectTemplate";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class ClearCanvas implements ActiveToolbarItem {
    onActivate(): void {
        const { atomsMap, bondsMap } = EntitiesMapsStorage;

        bondsMap.forEach((bond) => {
            bond.destroy();
        });

        atomsMap.forEach((atom) => {
            atom.destroy();
        });
    }
}

const clearCanvasTool = new ClearCanvas();

RegisterToolbarWithName(ToolsConstants.ToolsNames.Clear, clearCanvasTool);

const clearCanvas = new SimpleToolbarItemButtonBuilder("Clear Canvas", ToolsConstants.ToolsNames.Clear, ["B"]);

export default clearCanvas;
