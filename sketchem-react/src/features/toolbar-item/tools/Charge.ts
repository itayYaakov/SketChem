/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ToolsConstants from "@constants/tools.constants";
import { Atom } from "@entities";
import { EditorHandler } from "@features/editor/EditorHandler";
import { IChargeAttributes, MouseEventCallBackProperties } from "@src/types";

import { ActiveToolbarItem, ToolbarItemButton } from "../ToolbarItem";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

export interface ChargeToolbarItemButton extends ToolbarItemButton {
    attributes: IChargeAttributes;
}

class Charge implements ActiveToolbarItem {
    private charge: number = 0;

    protected changeSelectionCharge(editor: EditorHandler) {
        // This function is called when the user clicks on the charge button,
        // and it changes the charge of the selected atoms.
        const setAtomCharge = (atom: Atom) => {
            this.updateAtomCharge(atom);
        };

        editor.applyFunctionToAtoms(setAtomCharge, true);
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
    }

    onActivate(attributes: IChargeAttributes, editor: EditorHandler) {
        this.charge = attributes.charge;
        this.changeSelectionCharge(editor);
        editor.setHoverMode(true, true, false);
    }

    updateAtomCharge(atom: Atom) {
        const attrs = atom.getAttributes();
        attrs.charge += this.charge;
        atom.updateAttributes({ charge: attrs.charge });
    }

    onMouseClick(eventHolder: MouseEventCallBackProperties) {
        const { editor } = eventHolder;

        const atom = editor.getHoveredAtom();
        if (!atom) return;

        this.updateAtomCharge(atom);
    }
}

const charge = new Charge();

RegisterToolbarWithName(ToolsConstants.ToolsNames.Charge, charge);

const ChargeMinus: ChargeToolbarItemButton = {
    name: "Charge Minus",
    subToolName: ToolsConstants.SubToolsNames.ChargeMinus,
    toolName: ToolsConstants.ToolsNames.Charge,
    attributes: { charge: -1 },
    keyboardKeys: ["A"],
};

const ChargePlus: ChargeToolbarItemButton = {
    name: "Charge Plus",
    subToolName: ToolsConstants.SubToolsNames.ChargePlus,
    toolName: ToolsConstants.ToolsNames.Charge,
    attributes: { charge: 1 },
    keyboardKeys: ["A"],
};

RegisterToolbarButtonWithName(ChargeMinus);
RegisterToolbarButtonWithName(ChargePlus);

export { ChargeMinus, ChargePlus };
