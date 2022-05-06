import { AtomAttributes, BondAttributes } from "@types";
import Vector2 from "@utils/mathsTs/Vector2";

export class Atom {
    static instancesCounter = 0;

    static map = new Map<number, Atom>();

    static DefaultAttributes: AtomAttributes = {
        id: -1,
        charge: 0,
        symbol: "C",
        color: "#ffffff",
        center: Vector2.zero,
    };

    attributes: AtomAttributes;

    // label: any;
    constructor(attrs: Partial<AtomAttributes>) {
        // this.attributes = { ...Bond.DefaultAttributes, ...attributes };
        const id = attrs.id && attrs.id > 0 ? attrs.id : Atom.generateNewId();
        this.attributes = { ...Atom.DefaultAttributes, ...attrs, id };
        // constructor(attributes: AtomAttributes) {
        console.log(this.attributes.color);
        // this.label = attributes.label;
        // this.charge = getValueOrDefault(attributes.charge, Atom.attrlist.isotope);
        this.addInstanceToMap();
    }

    addInstanceToMap() {
        if (Atom.map.has(this.attributes.id)) {
            console.error("Object already exists!");
        }
        if (Atom.map.has(this.attributes.id)) return;
        Atom.map.set(this.attributes.id, this);
    }

    removeInstanceFromMap() {
        if (!Atom.map.has(this.attributes.id)) return;
        Atom.map.delete(this.attributes.id);
    }

    getId() {
        return this.attributes.id;
    }

    static getElementStringId(idNum: number) {
        return `atom_${idNum}`;
    }

    static getInstanceById(idNum: number) {
        return Atom.map.get(idNum);
    }

    static generateNewId() {
        const lastId = Atom.instancesCounter;
        Atom.instancesCounter += 1;
        return lastId;
    }
}
