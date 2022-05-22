import { EntitiesMapsStorage } from "@features/shared/storage";

// eslint-disable-next-line import/extensions
import * as K from "./kekule-js-dist/kekule.js?module=core,algorithm,calculation,io,extra";

const { Kekule } = K;

export const KekuleUtils = {
    getKekule: () => Kekule,
    getNumericId: (id) => {
        switch (typeof id) {
            case "string": {
                const result = parseInt(id.match(/[0-9]+$/)[0], 10);
                if (Number.isNaN(result)) {
                    throw new Error(`Id type unkown ${id}`);
                }
                return result;
            }
            case "number":
                return id;
            default:
                throw new Error(`Id type unkown ${id}`);
        }
    },
    registerAtomFromAttributes(attributes) {
        // AtomAttributes:
        // id: number;
        // center: Vector2;
        // charge: number;
        // symbol: string;
        // color: string;
        const atom = new Kekule.Atom();
        atom.id = attributes.id;
        const { symbol, charge, center } = attributes;
        atom.setSymbol(symbol);
        atom.setCharge(charge);
        atom.setCoord2D(center.get());
        return atom;
    },
    registerBondFromAttributes(attributes) {
        // id: number;
        // type: BondOrder;
        // stereo: BondStereoKekule;
        // atomStartId: number;
        // atomEndId: number;
        const { id, order, stereo, atomStartId, atomEndId } = attributes;

        const { atomsMap } = EntitiesMapsStorage;
        const startAtom = EntitiesMapsStorage.getMapInstanceById(atomsMap, atomStartId).getKekuleNode();
        const endAtom = EntitiesMapsStorage.getMapInstanceById(atomsMap, atomEndId).getKekuleNode();

        const bond = new Kekule.Bond();
        bond.setId(id);
        bond.setBondOrder(order);
        bond.setConnectedObjs([startAtom, endAtom]);
        bond.setStereo(stereo);

        return bond;
    },
};
