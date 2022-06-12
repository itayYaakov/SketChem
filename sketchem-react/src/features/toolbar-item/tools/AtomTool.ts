import { AtomConstants } from "@constants/atom.constants";
import { ElementsData, PtElement } from "@constants/elements.constants";
import { BondOrder, BondStereoKekule, MouseMode } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import { Atom } from "@entities";
import { EditorHandler } from "@features/editor/EditorHandler";
import { IAtomAttributes, MouseEventCallBackProperties } from "@types";

import { ToolbarItemButton } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { BondEntityBaseTool as EntityBaseTool } from "./BondEntityBaseTool.helper";
import { boxSelectTool } from "./SelectTemplate";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

export interface AtomToolbarItemButton extends ToolbarItemButton {
    attributes: IAtomAttributes;
}

export class AtomToolBarItem extends EntityBaseTool {
    atomElement!: PtElement;

    bondOrder: BondOrder = BondOrder.Single;

    bondStereo: BondStereoKekule = BondStereoKekule.NONE;

    init() {
        this.mode = MouseMode.Default;
        this.context = {
            dragged: false,
        };
    }

    onActivate(attributes: IAtomAttributes, editor: EditorHandler) {
        this.init();
        const atomElement = ElementsData.elementsBySymbolMap.get(attributes.label);
        if (!atomElement) throw new Error(`Atom element with symbol ${attributes.label} wasn't not found`);
        this.atomElement = atomElement;
        this.symbol = atomElement.symbol;
        this.changeSelectionAtoms(editor);
        editor.setHoverMode(true, true, false);
    }

    changeSelectionAtoms(editor: EditorHandler) {
        const mySymbol = this.atomElement.symbol;

        const updateAtomAttributes = (atom: Atom) => {
            atom.updateAttributes({
                symbol: mySymbol,
            });
        };

        editor.applyFunctionToAtoms(updateAtomAttributes, true);
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
    }

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        this.init();
        const { mouseDownLocation } = eventHolder;

        if (this.atomWasPressed(mouseDownLocation, eventHolder)) return;

        this.mode = MouseMode.EmptyPress;
        this.context.startAtom = this.createAtom(mouseDownLocation);
        this.context.startAtomIsPredefined = false;
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        const { editor, mouseDownLocation } = eventHolder;
        editor.setHoverMode(true, true, false);

        if (this.mode === MouseMode.Default) {
            // !!! ??? what to do
            return;
        }

        if (this.mode === MouseMode.EmptyPress && !this.context.startAtom) {
            if (!this.context.dragged && !this.context.startAtom) {
                this.context.startAtom = this.createAtom(mouseDownLocation);
                this.context.startAtomIsPredefined = false;
            } else {
                return;
            }
        }

        this.context.startAtom?.getOuterDrawCommand();

        // update pressed atom symbol only if it was pressed and there was no drag
        if (
            this.mode === MouseMode.AtomPressed &&
            !this.context.dragged &&
            this.context.startAtom &&
            this.context.endAtom === undefined
        ) {
            this.context.startAtom.updateAttributes({ symbol: this.atomElement.symbol });
        }

        editor.setHoverMode(true, true, true);
    }
}

const atom = new AtomToolBarItem();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Atom, atom);

const defaultAtomButtons: AtomToolbarItemButton[] = [];
AtomConstants.DefaultAtomsLabel.forEach((label) => {
    const element = ElementsData.elementsBySymbolMap.get(label);
    const newButton: AtomToolbarItemButton = {
        name: `${label} Atom`,
        subToolName: `${label} Atom`,
        toolName: ToolsConstants.ToolsNames.Atom,
        attributes: {
            label,
            color: element?.customColor ?? element?.cpkColor ?? element?.jmolColor ?? "#000000",
        },
        keyboardKeys: ["A"],
    };
    RegisterToolbarButtonWithName(newButton);
    defaultAtomButtons.push(newButton);
});

export default defaultAtomButtons;
