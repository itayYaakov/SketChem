/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType } from "@constants/enum.constants";
import type { Atom, Bond } from "@entities";
import knn from "@features/shared/rbushKnn";
import type { NamedPoint } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";

import { ActiveToolbarItem } from "../ToolbarItem";
import { BoxSelect } from "./SelectTemplate";

class ClearCanvas implements ActiveToolbarItem {
    name: string;

    keyboardKeys?: string[];

    constructor(name: string, keyboardKeys?: string[]) {
        this.name = name;
        this.keyboardKeys = keyboardKeys;
    }

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

const clearCanvas = new ClearCanvas("clean", ["A"]);

export default clearCanvas;
