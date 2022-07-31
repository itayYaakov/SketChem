import { BondOrder, BondStereoKekule, EntityVisualState, MouseMode } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import { IBondAttributes, MouseEventCallBackProperties } from "@types";

import { LaunchAttrs, ToolbarItemButton } from "../ToolbarItem";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { EntityBaseTool } from "./BondEntityBaseTool.helper";
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

    onDeactivate() {
        console.log("onDeactivate: BondTool");
        this.init();
    }

    onActivate(attrs?: LaunchAttrs) {
        console.log("onActivate: BondTool");
        if (!attrs) return;
        const { toolAttributes, editor } = attrs;
        if (!toolAttributes || !editor) {
            throw new Error("BondTool.onActivate: missing attributes or editor");
        }
        const attributes = toolAttributes as IBondAttributes;
        this.init();
        this.bondOrder = attributes.bondOrder;
        this.bondStereo = attributes.bondStereo;

        this.changeSelectionBonds(editor);
        editor.setHoverMode(true, true, true);
    }

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        // console.log("on mouse down");
        this.init();
        const { mouseDownLocation } = eventHolder;

        if (this.atomWasPressed(mouseDownLocation, eventHolder)) return;

        if (this.bondWasPressed(mouseDownLocation, eventHolder)) return;

        this.mode = MouseMode.EmptyPress;
        this.context.startAtom = this.createAtom(mouseDownLocation);
        // console.log(
        //     "BondTool.onMouseDown: startAtom created with id: ",
        //     this.context.startAtom.getId(),
        //     "lifestage",
        //     this.context.startAtom.getLifeStage()
        // );
        this.context.startAtomIsPredefined = false;

        // if (this.context.startAtom.getLifeStage() > 2) {
        //     console.error("I'm dead");
        // }
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        // console.log("on mouse up");
        if (!this.context || !this.context.startAtom) return;

        const { editor } = eventHolder;

        this.context.startAtom?.execOuterDrawCommand();
        // console.log(
        //     "BondTool.onMouseUp: startAtom created with id: ",
        //     this.context.startAtom.getId(),
        //     "lifestage",
        //     this.context.startAtom.getLifeStage()
        // );
        this.context.endAtom?.execOuterDrawCommand();

        if (this.mode === MouseMode.Default) {
            return;
        }

        if (this.mode === MouseMode.BondPressed) {
            return;
        }

        if (this.mode === MouseMode.EmptyPress && this.context.endAtom) {
            this.init();
            editor.setHoverMode(true, true, true);
            this.createHistoryUpdate(eventHolder);
            return;
        }

        if (this.mode === MouseMode.AtomPressed && !this.context.endAtom) {
            this.context.startAtom?.setVisualState(EntityVisualState.AnimatedClick);
        }

        this.context.startAtom?.execOuterDrawCommand();

        if (this.context.endAtom === undefined && !this.context.dragged) {
            if (!this.context.startAtom) {
                throw new Error("startAtom is undefined");
            }

            const endAtomCenter = this.calculatePosition(this.context.startAtom);
            this.context.endAtom = this.createAtom(endAtomCenter);
            this.context.endAtomIsPredefined = false;

            this.context.startAtom.execOuterDrawCommand();
            this.context.endAtom.execOuterDrawCommand();
        }

        this.createMoveAndHandleBond();
        this.init();
        editor.setHoverMode(true, true, true);
        this.createHistoryUpdate(eventHolder);
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
    keyboardKeys: ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.SubToolsNames.BondSingle),
};
const doubleBond: BondToolButton = {
    name: "Bond Double",
    subToolName: ToolsConstants.SubToolsNames.BondDouble,
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Double,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.SubToolsNames.BondDouble),
};
const tripleBond: BondToolButton = {
    name: "Bond Triple",
    subToolName: ToolsConstants.SubToolsNames.BondTriple,
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Triple,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.SubToolsNames.BondTriple),
};

const singleOrDoubleBond: BondToolButton = {
    name: "Bond Single or Double",
    subToolName: ToolsConstants.SubToolsNames.BondSingleOrDouble,
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.SingleOrDouble,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.SubToolsNames.BondSingleOrDouble),
};

const wedgeFrontBond: BondToolButton = {
    name: "Bond Wedge Front",
    subToolName: ToolsConstants.SubToolsNames.BondWedgeFront,
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.UP,
    },
    keyboardKeys: ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.SubToolsNames.BondWedgeFront),
};
const wedgeBackBond: BondToolButton = {
    name: "Bond Wedge Back",
    subToolName: ToolsConstants.SubToolsNames.BondWedgeBack,
    toolName: ToolsConstants.ToolsNames.Bond,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.DOWN,
    },
    keyboardKeys: ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.SubToolsNames.BondWedgeBack),
};

RegisterToolbarButtonWithName(doubleBond);
RegisterToolbarButtonWithName(singleBond);
RegisterToolbarButtonWithName(tripleBond);
RegisterToolbarButtonWithName(singleOrDoubleBond);
RegisterToolbarButtonWithName(wedgeBackBond);
RegisterToolbarButtonWithName(wedgeFrontBond);

export { doubleBond, singleBond, singleOrDoubleBond, tripleBond, wedgeBackBond, wedgeFrontBond };
