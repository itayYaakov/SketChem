import { BondOrder, BondStereoKekule, LayersNames } from "@constants/enum.constants";
import { Atom, Bond } from "@entities";
import { LayersUtils } from "@src/utils/LayersUtils";
import { BondAttributes, IAtom, IBond, MouseEventCallBackProperties } from "@types";

import { ActiveToolbarItem } from "../ToolbarItem";

class BondToolBarItem implements ActiveToolbarItem {
    name: string;

    bondOrder: BondOrder;

    bondStereo: BondStereoKekule;

    keyboardKeys?: string[];

    constructor(name: string, bondType: BondOrder, bondStereo: BondStereoKekule, keyboardKeys?: string[]) {
        this.name = name;
        this.bondOrder = bondType;
        this.bondStereo = bondStereo;
        this.keyboardKeys = keyboardKeys ?? undefined;
    }

    static lastBond: Bond;

    static lastAtom: Atom;

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation } = eventHolder;

        let startAtom;
        let endAtom;
        if (!BondToolBarItem.lastAtom) {
            startAtom = new Atom({ props: { symbol: "C", center: mouseDownLocation } } as IAtom);
            endAtom = new Atom({ props: { symbol: "C", center: mouseDownLocation } } as IAtom);

            startAtom.draw();
            endAtom.draw();
        } else {
            startAtom = BondToolBarItem.lastAtom;
            endAtom = new Atom({ props: { symbol: "Xe", center: mouseDownLocation } } as IAtom);

            endAtom.draw();
        }

        const bondArgs = {
            props: {
                order: this.bondOrder,
                stereo: this.bondStereo,
                atomStartId: startAtom.getId(),
                atomEndId: endAtom.getId(),
            },
        } as IBond;

        const bond = new Bond(bondArgs);
        BondToolBarItem.lastAtom = endAtom;
        BondToolBarItem.lastBond = bond;
        bond.draw();
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        if (!BondToolBarItem.lastBond) return;
        if (!BondToolBarItem.lastAtom) return;
        const { mouseDownLocation, mouseCurrentLocation } = eventHolder;
        // console.log(
        //     "mouseCurrentLocation=",
        //     mouseCurrentLocation,
        //     "BondToolBarItem.lastAtom center=",
        //     BondToolBarItem.lastAtom.attributes.center
        // );
        BondToolBarItem.lastAtom.move(mouseCurrentLocation);
        BondToolBarItem.lastBond.move(BondToolBarItem.lastAtom.getId());
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {}
}

const singleBond = new BondToolBarItem("Bond Single", BondOrder.Single, BondStereoKekule.NONE, ["A"]);
const doubleBond = new BondToolBarItem("Bond Double", BondOrder.Double, BondStereoKekule.NONE, ["B"]);
const tripleBond = new BondToolBarItem("Bond Triple", BondOrder.Triple, BondStereoKekule.NONE, ["C"]);
const wedgeFrontBond = new BondToolBarItem("Bond Wedge Front", BondOrder.Single, BondStereoKekule.UP, ["D"]);
const wedgeBackBond = new BondToolBarItem("Bond Wedge Back", BondOrder.Single, BondStereoKekule.DOWN, ["D"]);

export { doubleBond, singleBond, tripleBond, wedgeBackBond, wedgeFrontBond };
