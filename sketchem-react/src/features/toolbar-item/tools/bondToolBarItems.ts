/* eslint-disable class-methods-use-this */
import { BondStereo, BondType } from "@constants/enum.constants";
import { Atom, Bond } from "@entities";
import { BondAttributes, MouseEventCallBackProperties } from "@types";

import { ActiveToolbarItem } from "../ToolbarItem";

class BondToolBarItem implements ActiveToolbarItem {
    name: string;

    bondType: BondType;

    bondStereo: BondStereo;

    keyboardKeys?: string[];

    constructor(name: string, bondType: BondType, bondStereo: BondStereo, keyboardKeys?: string[]) {
        this.name = name;
        this.bondType = bondType;
        this.bondStereo = bondStereo;
        this.keyboardKeys = keyboardKeys ?? undefined;
    }

    static lastBond: Bond;

    static lastAtom: Atom;

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation, canvas } = eventHolder;
        let startAtom;
        let endAtom;
        if (!BondToolBarItem.lastAtom) {
            startAtom = new Atom({ symbol: "C", center: mouseDownLocation });
            endAtom = new Atom({ symbol: "C", center: mouseDownLocation });

            startAtom.draw(canvas);
            endAtom.draw(canvas);
        } else {
            startAtom = BondToolBarItem.lastAtom;
            endAtom = new Atom({ symbol: "Xe", center: mouseDownLocation });

            endAtom.draw(canvas);
        }

        const bond = new Bond(this.bondType, this.bondStereo, startAtom.getId(), endAtom.getId());
        BondToolBarItem.lastAtom = endAtom;
        BondToolBarItem.lastBond = bond;
        bond.draw(canvas);
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        if (!BondToolBarItem.lastBond) return;
        if (!BondToolBarItem.lastAtom) return;
        const { canvas, mouseDownLocation, mouseCurrentLocation } = eventHolder;
        // console.log(
        //     "mouseCurrentLocation=",
        //     mouseCurrentLocation,
        //     "BondToolBarItem.lastAtom center=",
        //     BondToolBarItem.lastAtom.attributes.center
        // );
        BondToolBarItem.lastAtom.move(canvas, mouseCurrentLocation);
        BondToolBarItem.lastBond.move(canvas, BondToolBarItem.lastAtom.getId());
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {}
}

const singleBond = new BondToolBarItem("Bond Single", BondType.Single, BondStereo.None, ["A"]);
const doubleBond = new BondToolBarItem("Bond Double", BondType.Double, BondStereo.None, ["B"]);
const tripleBond = new BondToolBarItem("Bond Triple", BondType.Triple, BondStereo.None, ["C"]);
const wedgeFrontBond = new BondToolBarItem("Bond Wedge Front", BondType.Single, BondStereo.Up, ["D"]);
const wedgeBackBond = new BondToolBarItem("Bond Wedge Back", BondType.Single, BondStereo.Down, ["D"]);

export { doubleBond, singleBond, tripleBond, wedgeBackBond, wedgeFrontBond };
