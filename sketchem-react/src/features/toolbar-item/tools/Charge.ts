/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType } from "@constants/enum.constants";
import type { NamedPoint } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { MouseEventCallBackProperties } from "@src/types";

import { ActiveToolbarItem } from "../ToolbarItem";

class Charge implements ActiveToolbarItem {
    name: string;

    keyboardKeys?: string[];

    private charge: number;

    constructor(name: string, charge: number, keyboardKeys?: string[]) {
        this.name = name;
        this.keyboardKeys = keyboardKeys ?? undefined;
        this.charge = charge;
    }

    onMouseClick(eventHolder: MouseEventCallBackProperties) {
        const { mouseCurrentLocation } = eventHolder;

        const atomMaxDistance = AtomConstants.SelectDistance;
        const NeighborsToFind = 1;
        const { atomsTree, atomsMap, knn } = EntitiesMapsStorage;

        const closetSomethings = knn(
            atomsTree,
            mouseCurrentLocation.x,
            mouseCurrentLocation.y,
            NeighborsToFind,
            atomMaxDistance
        );
        const [closest] = closetSomethings;

        if (!closest) return;

        const closestNode = closest.node as NamedPoint;

        if (closestNode.entityType !== EntityType.Atom) return;

        const { id } = closestNode;
        const atom = EntitiesMapsStorage.getAtomById(id);

        const attrs = atom.getAttributes();
        attrs.charge += this.charge;
        atom.updateAttributes({ charge: attrs.charge });
    }
}

const ChargePlus = new Charge("Charge Plus", 1, ["A"]);
const ChargeMinus = new Charge("Charge Minus", -1, ["A"]);

export { ChargeMinus, ChargePlus };
