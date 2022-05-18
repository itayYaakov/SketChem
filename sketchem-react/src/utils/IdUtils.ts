export const IdUtils = {
    getBondElemId: (idNum: number) => `bond_${idNum}`,
    getAtomElemId: (idNum: number) => `atom_${idNum}`,
    idIsOfBondElem: (id: string): number | undefined => (id.startsWith("bond_") ? Number(id.split("_")[1]) : undefined),
    idIsOfAtomElem: (id: string): number | undefined => (id.startsWith("atom_") ? Number(id.split("_")[1]) : undefined),
};
