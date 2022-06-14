import { BondOrder, BondStereoKekule, EntityVisualState, MouseMode } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import { EditorHandler } from "@features/editor/EditorHandler";
import { IBondAttributes, MouseEventCallBackProperties } from "@types";

import { ToolbarItemButton } from "../ToolbarItem";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { BondEntityBaseTool } from "./BondEntityBaseTool.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

export interface BondToolButton extends ToolbarItemButton {
    attributes: IBondAttributes;
}
export class BondTool extends BondEntityBaseTool {
    init() {
        this.mode = MouseMode.Default;
        console.debug(`Bond ${this.context?.bond?.getId()} was destroyed`);
        this.context = {};
        this.context.dragged = false;
        this.symbol = "C";
    }

    onActivate(attributes: IBondAttributes, editor: EditorHandler) {
        this.init();
        this.bondOrder = attributes.bondOrder;
        this.bondStereo = attributes.bondStereo;

        this.changeSelectionBonds(editor);
        editor.setHoverMode(true, true, true);
    }

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        this.init();
        const { mouseDownLocation, editor } = eventHolder;

        if (this.atomWasPressed(mouseDownLocation, eventHolder)) return;

        if (this.bondWasPressed(mouseDownLocation, eventHolder)) return;

        this.mode = MouseMode.EmptyPress;
        this.context.startAtom = this.createAtom(mouseDownLocation);
        this.context.startAtomIsPredefined = false;
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        const { editor } = eventHolder;

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
            this.context.startAtom?.setVisualState(EntityVisualState.AnimatedClick);
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
        editor.setHoverMode(true, true, true);
    }
}

const bond = new BondTool();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Bond, bond);

const singleBond: BondToolButton = {
    name: "Bond Single",
    subToolName: ToolsConstants.SubToolsNames.BondSingle,
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ["A"],
};
const doubleBond: BondToolButton = {
    name: "Bond Double",
    subToolName: ToolsConstants.SubToolsNames.BondDouble,
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Double,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ["B"],
};
const tripleBond: BondToolButton = {
    name: "Bond Triple",
    subToolName: ToolsConstants.SubToolsNames.BondTriple,
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Triple,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ["C"],
};
const wedgeFrontBond: BondToolButton = {
    name: "Bond Wedge Front",
    subToolName: ToolsConstants.SubToolsNames.BondWedgeFront,
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.UP,
    },
    keyboardKeys: ["D"],
};
const wedgeBackBond: BondToolButton = {
    name: "Bond Wedge Back",
    subToolName: ToolsConstants.SubToolsNames.BondWedgeBack,
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.DOWN,
    },
    keyboardKeys: ["D"],
};

RegisterToolbarButtonWithName(doubleBond);
RegisterToolbarButtonWithName(singleBond);
RegisterToolbarButtonWithName(tripleBond);
RegisterToolbarButtonWithName(wedgeBackBond);
RegisterToolbarButtonWithName(wedgeFrontBond);

export { doubleBond, singleBond, tripleBond, wedgeBackBond, wedgeFrontBond };
