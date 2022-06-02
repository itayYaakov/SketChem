export const AtomConstants = {
    HoverRadius: 20,
    HoverStrokeWidth: 4,
    SelectDistance: -1,
    DefaultAtomsLabel: ["H", "C", "N", "O", "S", "P", "F", "Cl", "Br", "I"],
    MaxAdditionalAtoms: 7,
};
AtomConstants.SelectDistance = AtomConstants.HoverRadius + AtomConstants.HoverStrokeWidth / 2;
