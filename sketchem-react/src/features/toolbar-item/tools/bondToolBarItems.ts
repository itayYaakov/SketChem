/* eslint-disable class-methods-use-this */
import { BondType } from "@constants/enum.constants";
import { Atom, Bond } from "@entities";
// !!! MOVE TO REDUX??
import { BondAdd, BondMove } from "@features/sketchpad/bond";
import { BondAttributes, BondEditorContext, MouseEventCallBackProperties } from "@types";
import { Vector } from "vector2d";

import ToolbarItem from "../ToolbarItem";

class BondToolBarItem implements ToolbarItem {
    name: string;

    bondType: BondType;

    keyboardKeys?: string[];

    constructor(name: string, bondType: BondType, keyboardKeys?: string[]) {
        this.name = name;
        this.bondType = bondType;
        this.keyboardKeys = keyboardKeys ?? undefined;
    }

    static lastBond: Bond;

    static lastAtom: Atom;

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation } = eventHolder;
        const startAtom = new Atom({ symbol: "C", center: mouseDownLocation });
        const endAtom = new Atom({ symbol: "C", center: mouseDownLocation.addValues(5, 5) });

        const bondEntity = new Bond(this.bondType, startAtom.getId(), endAtom.getId());
        const props: BondEditorContext = {
            bondAttrs: bondEntity.attributes,
            movedAtomId: bondEntity.attributes.atomEndId,
            // elem: undefined,
            canvas: eventHolder.canvas,
        };
        // !!! remove
        const a = Atom.getInstanceById(Atom.instancesCounter - 1);
        const b = Bond.getInstanceById(Bond.instancesCounter - 1);
        if (!a) {
            console.error("Atom is undefined", a);
            return;
        }
        BondToolBarItem.lastAtom = a;
        if (!b) {
            console.error("Bond is undefined", b);
            return;
        }
        BondToolBarItem.lastBond = b;
        // !!! MOVE TO REDUX
        BondAdd(props);
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        if (!BondToolBarItem.lastBond) return;
        if (!BondToolBarItem.lastAtom) return;
        const { canvas, mouseDownLocation, mouseCurrentLocation } = eventHolder;
        BondToolBarItem.lastAtom.attributes.center = mouseCurrentLocation;
        const props: BondEditorContext = {
            bondAttrs: BondToolBarItem.lastBond.attributes,
            movedAtomId: Atom.instancesCounter - 1,
            canvas,
        };
        BondMove(props);
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {}
}

const singleBond = new BondToolBarItem("Bond Single", BondType.Single, ["A"]);
const doubleBond = new BondToolBarItem("Bond Double", BondType.Double, ["B"]);
const tripleBond = new BondToolBarItem("Bond Triple", BondType.Triple, ["C"]);
const wedgeFrontBond = new BondToolBarItem("Bond Wedge Front", BondType.WedgeFront, ["K"]);
const wedgeBackBond = new BondToolBarItem("Bond Wedge Back", BondType.WedgeBack, ["D"]);

export { doubleBond, singleBond, tripleBond, wedgeBackBond, wedgeFrontBond };
