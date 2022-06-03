/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import type { NamedPoint } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { IChargeAttributes, MouseEventCallBackProperties } from "@src/types";

import { ActiveToolbarItem, ToolbarItemButton } from "../ToolbarItem";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

export interface ChargeToolbarItemButton extends ToolbarItemButton {
    attributes: IChargeAttributes;
}

class Charge implements ActiveToolbarItem {
    private charge: number = 0;

    onActivate(attributes: IChargeAttributes) {
        this.charge = attributes.charge;
    }

    onMouseClick(eventHolder: MouseEventCallBackProperties) {
        const { mouseCurrentLocation } = eventHolder;

        const atomMaxDistance = AtomConstants.SelectDistance;
        const NeighborsToFind = 1;
        const { atomsTree, knn } = EntitiesMapsStorage;

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

const charge = new Charge();

RegisterToolbarWithName(ToolsConstants.ToolsNames.Charge, charge);

const ChargeMinus: ChargeToolbarItemButton = {
    name: "Charge Minus",
    toolName: ToolsConstants.ToolsNames.Charge,
    attributes: { charge: -1 },
    keyboardKeys: ["A"],
};

const ChargePlus: ChargeToolbarItemButton = {
    name: "Charge Plus",
    toolName: ToolsConstants.ToolsNames.Charge,
    attributes: { charge: 1 },
    keyboardKeys: ["A"],
};

export { ChargeMinus, ChargePlus };
