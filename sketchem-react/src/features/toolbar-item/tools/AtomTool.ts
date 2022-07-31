import { ElementsData, PtElement } from "@constants/elements.constants";
import { BondOrder, BondStereoKekule, EntityVisualState, MouseMode } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import { Atom } from "@entities";
import { EditorHandler } from "@features/editor/EditorHandler";
import { IAtomAttributes, MouseEventCallBackProperties } from "@types";

import { LaunchAttrs, ToolbarItemButton } from "../ToolbarItem";
import { IsToolbarButtonExists, RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { EntityBaseTool } from "./BondEntityBaseTool.helper";
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

    onDeactivate() {
        this.init();
    }

    onActivate(attrs?: LaunchAttrs) {
        if (!attrs) return;
        const { toolAttributes, editor } = attrs;
        if (!toolAttributes || !editor) {
            throw new Error("AtomToolBarItem.onActivate: missing attributes or editor");
        }
        const attributes = toolAttributes as IAtomAttributes;
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
        let changed = 0;
        const updateAtomAttributes = (atom: Atom) => {
            atom.updateAttributes({
                symbol: mySymbol,
            });
            changed += 1;
        };

        editor.applyFunctionToAtoms(updateAtomAttributes, true);
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
        if (changed) editor.createHistoryUpdate();
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

        this.context.startAtom?.execOuterDrawCommand();

        // update pressed atom symbol only if it was pressed and there was no drag
        if (
            this.mode === MouseMode.AtomPressed &&
            !this.context.dragged &&
            this.context.startAtom &&
            this.context.endAtom === undefined
        ) {
            this.context.startAtom.setVisualState(EntityVisualState.AnimatedClick);
            this.context.startAtom.updateAttributes({ symbol: this.atomElement.symbol });
        }

        editor.setHoverMode(true, true, false);
        this.createHistoryUpdate(eventHolder);
    }
}

const atom = new AtomToolBarItem();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Atom, atom);

export function generateAtomsButtons(atoms: string[]) {
    const defaultAtomButtons: AtomToolbarItemButton[] = [];
    atoms.forEach((label) => {
        const element = ElementsData.elementsBySymbolMap.get(label);
        const customName = `${label} Atom`;
        const newButton: AtomToolbarItemButton = {
            name: customName,
            subToolName: customName,
            toolName: ToolsConstants.ToolsNames.Atom,
            attributes: {
                label,
                color: element?.customColor ?? element?.cpkColor ?? element?.jmolColor ?? "#000000",
            },
            keyboardKeys:
                ToolsConstants.ToolsShortcutsMapByToolName.get(customName) ??
                ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.ToolsNames.Atom),
        };
        if (!IsToolbarButtonExists(newButton)) {
            RegisterToolbarButtonWithName(newButton);
        }
        defaultAtomButtons.push(newButton);
    });
    return defaultAtomButtons;
}
