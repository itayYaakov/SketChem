import { BondOrder, BondStereoKekule, MouseMode } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { IBondAttributes, MouseEventCallBackProperties } from "@types";

import { ToolbarItemButton } from "../ToolbarItem";
import { EntityBaseTool } from "./EntityBaseTool.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

export interface BondToolButton extends ToolbarItemButton {
    attributes: IBondAttributes;
}
export class BondTool extends EntityBaseTool {
    init() {
        this.mode = MouseMode.Default;
        console.debug(`Bond ${this.context?.bond?.getId()} was destroyed`);
        this.context = {};
        this.context.dragged = false;
        this.symbol = "C";
    }

    onActivate(attributes: IBondAttributes) {
        this.init();
        this.bondOrder = attributes.bondOrder;
        this.bondStereo = attributes.bondStereo;
    }

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        this.init();
        const { mouseDownLocation } = eventHolder;

        if (this.atomWasPressed(mouseDownLocation)) return;

        if (this.bondWasPressed(mouseDownLocation)) return;

        this.mode = MouseMode.EmptyPress;
        this.context.startAtom = this.createAtom(mouseDownLocation);
        this.context.startAtomIsPredefined = false;
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        if (this.mode === MouseMode.Default) {
            // !!! ??? what to doc
            return;
        }

        if (this.mode === MouseMode.BondPressed) {
            return;
        }

        if (this.mode === MouseMode.EmptyPress && this.context.endAtom) {
            // !!! ??? all is draw - just need to send action?
            return;
        }

        if (this.mode === MouseMode.AtomPressed) {
            // !!! ??? nothing special to do?
            // return;
        }

        this.context.startAtom?.getOuterDrawCommand();

        if (this.context.endAtom === undefined && !this.context.dragged) {
            if (!this.context.startAtom) throw new Error("startAtom is undefined");

            const endAtomCenter = this.calculatePosition(this.context.startAtom);
            this.context.endAtom = this.createAtom(endAtomCenter);
            this.context.endAtomIsPredefined = false;

            this.context.startAtom.getOuterDrawCommand();
            this.context.endAtom.getOuterDrawCommand();
        }

        this.createMoveAndHandleBond();
        this.init();
    }
}

const bond = new BondTool();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Bond, bond);

const singleBond: BondToolButton = {
    name: "Bond Single",
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ["A"],
};
const doubleBond: BondToolButton = {
    name: "Bond Double",
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Double,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ["B"],
};
const tripleBond: BondToolButton = {
    name: "Bond Triple",
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Triple,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ["C"],
};
const wedgeFrontBond: BondToolButton = {
    name: "Bond Wedge Front",
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.UP,
    },
    keyboardKeys: ["D"],
};
const wedgeBackBond: BondToolButton = {
    name: "Bond Wedge Back",
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.DOWN,
    },
    keyboardKeys: ["D"],
};

export { doubleBond, singleBond, tripleBond, wedgeBackBond, wedgeFrontBond };
