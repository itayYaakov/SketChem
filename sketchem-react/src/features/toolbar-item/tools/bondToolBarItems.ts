import { EditorConstants } from "@constants/editor.constant";
import { BondOrder, BondStereoKekule, LayersNames, MouseMode } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { EntitiesMapsStorage } from "@features/shared/storage";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { BondAttributes, IAtom, IBond, MouseEventCallBackProperties } from "@types";

import { ActiveToolbarItem, ToolbarItemButton } from "../ToolbarItem";
import { EntityBaseTool } from "./EntityBaseTool.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

interface IBondAttributes {
    readonly bondOrder: BondOrder;

    readonly bondStereo: BondStereoKekule;
}
export interface BondToolbarItemButton extends ToolbarItemButton {
    attributes: IBondAttributes;
}
export class BondToolBarItem extends EntityBaseTool {
    bondOrder!: BondOrder;

    bondStereo!: BondStereoKekule;

    mode!: MouseMode;

    context!: {
        startAtom?: Atom;
        endAtom?: Atom;
        bond?: Bond;
        rotation?: number;
    };

    init() {
        this.mode = MouseMode.Default;
        this.context = {};
    }

    onActivate(attributes: IBondAttributes) {
        this.init();
        this.bondOrder = attributes.bondOrder;
        this.bondStereo = attributes.bondStereo;
    }

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        this.init();
        const { mouseDownLocation } = eventHolder;

        const { getAtomById, atomAtPoint, getBondById, bondAtPoint } = EntitiesMapsStorage;

        const atomWasPressed = atomAtPoint(mouseDownLocation);
        if (atomWasPressed) {
            this.mode = MouseMode.AtomPressed;
            const atom = getAtomById(atomWasPressed.id);
            this.context.startAtom = atom;
            return;
        }

        const bondWasPressed = bondAtPoint(mouseDownLocation);
        if (bondWasPressed) {
            this.mode = MouseMode.BondPressed;
            const bond = getBondById(bondWasPressed.id);
            const pressedBondAttributes = bond.getAttributes();
            const pressedBondNoneStereo = pressedBondAttributes.stereo === BondStereoKekule.NONE;
            const thisBondOrderSingle = this.bondOrder === BondOrder.Single;
            if (thisBondOrderSingle && this.bondStereo === BondStereoKekule.NONE && pressedBondNoneStereo) {
                let newBondOrder;
                switch (pressedBondAttributes.order) {
                    case BondOrder.Single:
                        newBondOrder = BondOrder.Double;
                        break;
                    case BondOrder.Double:
                        newBondOrder = BondOrder.Triple;
                        break;
                    case BondOrder.Triple:
                        newBondOrder = BondOrder.Single;
                        break;
                    default:
                        return;
                }
                bond.updateAttributes({ order: newBondOrder });
                return;
            }
            if (
                this.bondStereo === pressedBondAttributes.stereo &&
                this.bondOrder === pressedBondAttributes.order &&
                this.bondOrder === BondOrder.Single &&
                (this.bondStereo === BondStereoKekule.DOWN || this.bondStereo === BondStereoKekule.UP)
            ) {
                bond.updateAttributes({
                    atomStartId: pressedBondAttributes.atomEndId,
                    atomEndId: pressedBondAttributes.atomStartId,
                });
                return;
            }

            const newAttributes: Partial<BondAttributes> = {};
            if (pressedBondAttributes.order !== this.bondOrder) newAttributes.order = this.bondOrder;
            if (pressedBondAttributes.stereo !== this.bondStereo) newAttributes.stereo = this.bondStereo;
            if (newAttributes) bond.updateAttributes(newAttributes);
            return;
        }

        this.mode = MouseMode.EmptyPress;
        const startAtomCenter = mouseDownLocation;
        this.context.startAtom = this.createAtom(startAtomCenter, "C");
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation, mouseCurrentLocation } = eventHolder;

        if (this.mode === MouseMode.Default) {
            // !!! add hover
            return;
        }

        // if (this.mode === MouseMode.atomPressed) {
        //     // !!! add bond to atom
        //     return;
        // }

        if (this.mode === MouseMode.BondPressed) {
            // !!! change bond type
            return;
        }

        if (this.context.startAtom === undefined) {
            // !!! error
            return;
        }

        const distance = mouseCurrentLocation.distance(mouseDownLocation);
        // console.log("distance=", distance);

        let rotation = 0;
        if (distance > ToolsConstants.ValidMouseMoveDistance) {
            rotation = -mouseCurrentLocation.angle(mouseDownLocation);
        }
        const endAtomCenter = this.calculatePosition(this.context.startAtom, rotation);

        if (this.context.endAtom === undefined) {
            this.context.endAtom = this.createAtom(endAtomCenter, "C");
            this.context.startAtom.draw();
            this.context.endAtom.draw();
        } else {
            this.context.endAtom.updateAttributes({ center: endAtomCenter });
        }

        this.moveBondAndCreateIfNeeded();
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        if (this.mode === MouseMode.Default) {
            // !!! ??? what to doc
            return;
        }

        if (this.mode === MouseMode.AtomPressed) {
            // !!! ??? nothing special to do?
            // return;
        }

        if (this.mode === MouseMode.BondPressed) {
            return;
        }

        if (this.mode === MouseMode.EmptyPress && this.context.endAtom) {
            // !!! ??? all is draw - just need to send action?
            return;
        }

        if (this.context.endAtom === undefined) {
            if (!this.context.startAtom) throw new Error("startAtom is undefined");

            const endAtomCenter = this.calculatePosition(this.context.startAtom);
            this.context.endAtom = this.createAtom(endAtomCenter, "C");

            this.context.startAtom.draw();
            this.context.endAtom.draw();
        }

        this.moveBondAndCreateIfNeeded();
        this.init();
    }
}

const bond = new BondToolBarItem();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Bond, bond);

const singleBond: BondToolbarItemButton = {
    name: "Bond Single",
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ["A"],
};
const doubleBond: BondToolbarItemButton = {
    name: "Bond Double",
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Double,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ["B"],
};
const tripleBond: BondToolbarItemButton = {
    name: "Bond Triple",
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Triple,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ["C"],
};
const wedgeFrontBond: BondToolbarItemButton = {
    name: "Bond Wedge Front",
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.UP,
    },
    keyboardKeys: ["D"],
};
const wedgeBackBond: BondToolbarItemButton = {
    name: "Bond Wedge Back",
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.DOWN,
    },
    keyboardKeys: ["D"],
};

export { doubleBond, singleBond, tripleBond, wedgeBackBond, wedgeFrontBond };
