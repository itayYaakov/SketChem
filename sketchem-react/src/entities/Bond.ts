import { BondConstants } from "@constants/bond.constants";
import { BondType } from "@constants/enum.constants";
import { AtomAttributes, BondAttributes } from "@types";

import { Atom } from "./Atom";

export class Bond {
    static instancesCounter = 0;

    static map = new Map<number, Bond>();

    // just a demo for now
    static DefaultAttributes: Partial<BondAttributes> = {
        type: BondType.Single,
    };

    attributes: BondAttributes;

    // label: any;
    constructor(type: BondType, atomStartId: number, atomEndId: number, optional_id?: number) {
        // this.attributes = { ...Bond.DefaultAttributes, ...attributes };
        const id = optional_id ?? Bond.generateNewId();
        this.attributes = { ...Bond.DefaultAttributes, id, type, atomStartId, atomEndId };
        console.log(this.attributes.type);
        // this.label = attributes.label;
        // this.charge = getValueOrDefault(attributes.charge, Atom.attrlist.isotope);
        this.addInstanceToMap();
    }

    addInstanceToMap() {
        if (Bond.map.has(this.attributes.id)) {
            console.error("Object already exists!");
        }
        if (Bond.map.has(this.attributes.id)) return;
        Bond.map.set(this.attributes.id, this);
    }

    removeInstanceFromMap() {
        if (!Bond.map.has(this.attributes.id)) return;
        Bond.map.delete(this.attributes.id);
    }

    getId() {
        return this.attributes.id;
    }

    static getElementStringId(idNum: number) {
        return BondConstants.getElemId(idNum);
    }

    static getInstanceById(idNum: number) {
        return Bond.map.get(idNum);
    }

    static getConnectedAtoms(bondProps: BondAttributes) {
        const startAtom = Atom.getInstanceById(bondProps.atomStartId);
        const endAtom = Atom.getInstanceById(bondProps.atomEndId);
        if (!startAtom || !endAtom) {
            console.error("startAtom", startAtom, "endAtom", endAtom);
            return undefined;
        }
        return { startAtom, endAtom };
    }

    static generateNewId() {
        const lastId = Bond.instancesCounter;
        Bond.instancesCounter += 1;
        return lastId;
    }
}
