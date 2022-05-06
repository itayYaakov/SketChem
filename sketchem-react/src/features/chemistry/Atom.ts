import { AtomAttributes } from "@types";

export class Atom {
    static instances_counter = 0;

    // label: any;
    constructor(attributes: AtomAttributes) {
        console.log(attributes.color);
        // this.label = attributes.label;
        // this.charge = getValueOrDefault(attributes.charge, Atom.attrlist.isotope);
    }

    static get_string_id(id_num: number) {
        return `atom_${id_num}`;
    }
}
