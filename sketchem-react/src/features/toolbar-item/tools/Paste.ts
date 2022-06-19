import { store } from "@app/store";
import * as ToolsConstants from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { IAtom, IBond } from "@src/types";
import Vector2 from "@src/utils/mathsTs/Vector2";

import { ActiveToolbarItem, LaunchAttrs, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class Paste implements ActiveToolbarItem {
    onActivate(attrs?: LaunchAttrs) {
        if (!attrs) return;
        const { editor } = attrs;
        if (!editor) {
            throw new Error("Paste.onActivate: missing attributes or editor");
        }
        const ca = editor.copiedAtoms;
        const cb = editor.copiedBonds;

        if (ca.size === 0 || cb.size === 0) {
            store.dispatch(actions.asyncDispatchSelect());
            return;
        }

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
            a.execOuterDrawCommand();
        });

        createdBonds.forEach((b) => {
            b.moveByDelta(delta, false);
            b.execOuterDrawCommand();
        });

        editor.resetCopiedContents();
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
        editor.createHistoryUpdate();

        store.dispatch(actions.asyncDispatchSelect());
    }
}

const pasteTool = new Paste();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Paste, pasteTool);

const paste = new SimpleToolbarItemButtonBuilder("Paste", ToolsConstants.ToolsNames.Paste, ["B"]);

RegisterToolbarButtonWithName(paste);

export default paste;
