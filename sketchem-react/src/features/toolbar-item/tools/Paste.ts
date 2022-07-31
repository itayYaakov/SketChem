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
        const { atoms: ca, bonds: cb } = editor.copied;

        if (!ca || ca.length === 0 || !cb || cb.length === 0) {
            store.dispatch(actions.asyncDispatchSelect());
            return;
        }

        const createdAtoms = new Map<number, Atom>();
        const createdBonds = new Map<number, Bond>();

        const editorBoundingBox = editor.getBoundingBox();

        const mappedAtomsIds = new Map<number, number>();

        let pastedMinX = Number.MAX_SAFE_INTEGER;
        let pastedMaxX = Number.MIN_SAFE_INTEGER;
        let pastedMinY = Number.MAX_SAFE_INTEGER;
        let pastedMaxY = Number.MIN_SAFE_INTEGER;

        ca.forEach((a) => {
            const { attributes, id: oldId } = a;
            const newId = Atom.generateNewId();
            mappedAtomsIds.set(oldId, newId);
            attributes.id = newId;
            const args: IAtom = {
                props: attributes,
            };

            pastedMinX = Math.min(pastedMinX, attributes.center.x);
            pastedMaxX = Math.max(pastedMaxX, attributes.center.x);
            pastedMinY = Math.min(pastedMinY, attributes.center.y);
            pastedMaxY = Math.max(pastedMaxY, attributes.center.y);

            const newAtom = new Atom(args);
            createdAtoms.set(newAtom.getId(), newAtom);
        });

        cb.forEach((b) => {
            const { attributes } = b;
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

        const delta = new Vector2(editorBoundingBox.maxX * 1.1 - pastedMinX, editorBoundingBox.minY - pastedMinY);

        createdAtoms.forEach((a) => {
            a.moveByDelta(delta, movedBondsIds);
            a.execOuterDrawCommand();
        });

        createdBonds.forEach((b) => {
            b.moveByDelta(delta, false);
            b.execOuterDrawCommand();
        });

        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
        editor.createHistoryUpdate();

        store.dispatch(actions.asyncDispatchSelect());
    }
}

const pasteTool = new Paste();
RegisterToolbarWithName(ToolsConstants.ToolsNames.Paste, pasteTool);

const paste = new SimpleToolbarItemButtonBuilder(
    "Paste",
    ToolsConstants.ToolsNames.Paste,
    ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.ToolsNames.Paste)
);

RegisterToolbarButtonWithName(paste);

export default paste;
