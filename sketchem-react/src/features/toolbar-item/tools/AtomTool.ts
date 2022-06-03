import { AtomConstants } from "@constants/atom.constants";
import { ElementsData, PtElement } from "@constants/elements.constants";
import { BondOrder, BondStereoKekule, MouseMode } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { EntitiesMapsStorage } from "@features/shared/storage";
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

    init() {
        this.mode = MouseMode.Default;
        this.context = {};
    }

    onActivate(attributes: IAtomAttributes) {
        this.init();
        const atomElement = ElementsData.elementsBySymbolMap.get(attributes.label);
        if (!atomElement) throw new Error(`Atom element with symbol ${attributes.label} wasn't not found`);
        this.atomElement = atomElement;
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

        const { getAtomById, atomAtPoint } = EntitiesMapsStorage;

        const atomWasPressed = atomAtPoint(mouseDownLocation);
        if (atomWasPressed) {
            this.mode = MouseMode.AtomPressed;
            const atom = getAtomById(atomWasPressed.id);
            this.context.startAtom = atom;
            return;
        }

        this.mode = MouseMode.EmptyPress;
        const startAtomCenter = mouseDownLocation;
        const { symbol } = this.atomElement;
        this.context.startAtom = this.createAtom(startAtomCenter, symbol);
        this.context.startAtom.draw();
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation, mouseCurrentLocation } = eventHolder;

        if (!this.context.startAtom) return;
        if (this.mode !== MouseMode.AtomPressed && this.mode !== MouseMode.EmptyPress) return;

        const distance = mouseCurrentLocation.distance(mouseDownLocation);

        if (distance < ToolsConstants.ValidMouseMoveDistance) {
            this.context.endAtom?.destroy();
            return;
        }

        const rotation = -mouseCurrentLocation.angle(mouseDownLocation);

        const endAtomCenter = this.calculatePosition(this.context.startAtom, rotation);

        if (this.context.endAtom === undefined) {
            this.context.endAtom = this.createAtom(endAtomCenter, this.atomElement.symbol);
            this.context.endAtom.draw();
        } else {
            this.context.endAtom.updateAttributes({ center: endAtomCenter });
        }

        this.context.bond = this.context.bond ?? this.createBond();
        this.context.bond.movedByAtomId(this.context.endAtom.getId());
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

        if (this.mode === MouseMode.AtomPressed && this.context.startAtom && this.context.endAtom === undefined) {
            this.context.startAtom.updateAttributes({ symbol: this.atomElement.symbol });
            return;
        }

        this.init();
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
