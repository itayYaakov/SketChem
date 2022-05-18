export const IdUtils = {
    getBondElemId: (idNum: number) => `bond_${idNum}`,
    getAtomElemId: (idNum: number) => `atom_${idNum}`,
    getDefElemId: (name: string) => `def_${name}`,
    getLayerElemId: (name: string) => `layer_${name}`,
    getUrlId: (name: string) => `url(#${name})`,
    idIsOfBondElem: (id: string): number | undefined => (id.startsWith("bond_") ? Number(id.split("_")[1]) : undefined),
    idIsOfAtomElem: (id: string): number | undefined => (id.startsWith("atom_") ? Number(id.split("_")[1]) : undefined),
};
