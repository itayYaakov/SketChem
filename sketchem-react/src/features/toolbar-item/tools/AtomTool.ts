import { AtomConstants } from "@constants/atom.constants";
import { ElementsData, PtElement } from "@constants/elements.constants";
import { BondOrder, BondStereoKekule, MouseMode } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { EntitiesMapsStorage } from "@features/shared/storage";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { IAtomAttributes, MouseEventCallBackProperties } from "@types";

import { ToolbarItemButton } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { EntityBaseTool } from "./EntityBaseTool.helper";
import { boxSelectTool } from "./SelectTemplate";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

export interface AtomToolbarItemButton extends ToolbarItemButton {
    attributes: IAtomAttributes;
}

export class AtomToolBarItem extends EntityBaseTool {
    atomElement!: PtElement;

    bondOrder: BondOrder = BondOrder.Single;

    bondStereo: BondStereoKekule = BondStereoKekule.NONE;

    dragged: boolean = false;

    symbol!: string;

    init() {
        this.mode = MouseMode.Default;
        this.context = {};
        this.dragged = false;
    }

    onActivate(attributes: IAtomAttributes) {
        this.init();
        const atomElement = ElementsData.elementsBySymbolMap.get(attributes.label);
        if (!atomElement) throw new Error(`Atom element with symbol ${attributes.label} wasn't not found`);
        this.atomElement = atomElement;
        this.symbol = atomElement.symbol;
        this.changeSelectionAtoms();
    }

    changeSelectionAtoms() {
        // !!! remove lasso from this - be a more generic with editor context
        const selectedAtoms = boxSelectTool.getSelectedAtoms();

        const mySymbol = this.atomElement.symbol;
        selectedAtoms.forEach((atom) => {
            if (mySymbol !== atom.getSymbol()) {
                atom.updateAttributes({ symbol: mySymbol });
            }
        });

        boxSelectTool.resetSelection();
        actions.reset_tool();
    }

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        this.init();
        const { mouseDownLocation } = eventHolder;

        if (this.atomWasPressed(mouseDownLocation)) return;

        this.mode = MouseMode.EmptyPress;
        this.context.startAtom = this.createAtom(mouseDownLocation);
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        const { mouseUpLocation } = eventHolder;
        if (this.mode === MouseMode.Default) {
            // !!! ??? what to do
            return;
        }

        if (this.mode === MouseMode.EmptyPress && !this.context.startAtom) {
            return;
        }

        this.context.startAtom?.getOuterDrawCommand();

        // update pressed atom symbol only if it was pressed and there was no drag
        if (
            this.mode === MouseMode.AtomPressed &&
            !this.dragged &&
            this.context.startAtom &&
            this.context.endAtom === undefined
        ) {
            this.context.startAtom.updateAttributes({ symbol: this.atomElement.symbol });
        }
    }
}

const atom = new AtomToolBarItem();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Atom, atom);

const defaultAtomButtons: AtomToolbarItemButton[] = [];
AtomConstants.DefaultAtomsLabel.forEach((label) => {
    defaultAtomButtons.push({
        name: `${label} Atom`,
        toolName: ToolsConstants.ToolsNames.Atom,
        attributes: {
            label,
            color: ElementsData.elementsBySymbolMap.get(label)?.cpkColor ?? "black",
        },
        keyboardKeys: ["A"],
    });
});

export default defaultAtomButtons;
