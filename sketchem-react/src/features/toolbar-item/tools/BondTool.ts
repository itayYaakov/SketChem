import { EditorConstants } from "@constants/editor.constant";
import { BondOrder, BondStereoKekule, LayersNames, MouseMode } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { EntitiesMapsStorage } from "@features/shared/storage";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { BondAttributes, IAtom, IBond, IBondAttributes, MouseEventCallBackProperties } from "@types";

import { ActiveToolbarItem, ToolbarItemButton } from "../ToolbarItem";
import { EntityBaseTool } from "./EntityBaseTool.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

export interface BondToolButton extends ToolbarItemButton {
    attributes: IBondAttributes;
}
export class BondTool extends EntityBaseTool {
    bondOrder!: BondOrder;

    bondStereo!: BondStereoKekule;

    mode!: MouseMode;

    symbol!: string;

    context!: {
        startAtom?: Atom;
        endAtom?: Atom;
        bond?: Bond;
        rotation?: number;
    };

    dragged: boolean = false;

    init() {
        this.mode = MouseMode.Default;
        this.context = {};
        this.dragged = false;
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

        // this.mode === MouseMode.AtomPressed && !this.dragged

        if (this.context.endAtom === undefined && !this.dragged) {
            if (!this.context.startAtom) throw new Error("startAtom is undefined");

            const endAtomCenter = this.calculatePosition(this.context.startAtom);
            this.context.endAtom = this.createAtom(endAtomCenter);

            this.context.startAtom.getOuterDrawCommand();
            this.context.endAtom.getOuterDrawCommand();
        }

        this.moveBondAndCreateIfNeeded();
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
