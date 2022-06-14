import { store } from "@app/store";
import * as ToolsConstants from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { EditorHandler } from "@features/editor/EditorHandler";
import { IAtom, IBond } from "@src/types";
import Vector2 from "@src/utils/mathsTs/Vector2";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class Paste implements ActiveToolbarItem {
    onActivate(_: any, editor: EditorHandler): void {
        const ca = editor.copiedAtoms;
        const cb = editor.copiedBonds;

        const createdAtoms = new Map<number, Atom>();
        const createdBonds = new Map<number, Bond>();

        const delta = new Vector2(300, 300);

        const mappedAtomsIds = new Map<number, number>();

        ca.forEach((a) => {
            const attributes = a.getAttributes();
            const newId = Atom.generateNewId();
            mappedAtomsIds.set(attributes.id, newId);
            attributes.id = newId;
            const args: IAtom = {
                props: attributes,
            };

            const newAtom = new Atom(args);
            createdAtoms.set(newAtom.getId(), newAtom);
        });

        cb.forEach((b) => {
            const attributes = b.getAttributes();
            attributes.id = Bond.generateNewId();
            const newAtomStartId = mappedAtomsIds.get(attributes.atomStartId);
            const newAtomEndId = mappedAtomsIds.get(attributes.atomEndId);

            if (!newAtomStartId || !newAtomEndId) return;

            attributes.atomStartId = newAtomStartId;
            attributes.atomEndId = newAtomEndId;

            const args: IBond = {
                props: attributes,
            };
            const newBond = new Bond(args);
            createdBonds.set(newBond.getId(), newBond);
        });

        const movedBondsIds = Array.from(createdBonds.keys());

        createdAtoms.forEach((a) => {
            a.moveByDelta(delta, movedBondsIds);
            a.getOuterDrawCommand();
        });

        createdBonds.forEach((b) => {
            b.moveByDelta(delta, false);
            b.getOuterDrawCommand();
        });

        editor.resetCopiedContents();
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
        store.dispatch(actions.clearCanvas());
    }
}

const pasteTool = new Paste();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Paste, pasteTool);

const paste = new SimpleToolbarItemButtonBuilder("Paste", ToolsConstants.ToolsNames.Paste, ["B"]);

RegisterToolbarButtonWithName(paste);

export default paste;
