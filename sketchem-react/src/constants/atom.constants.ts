export const AtomConstants = {
    HoverRadius: 18,
    HoverStrokeWidth: 4,
    SelectDistance: -1,
    DefaultAtomsLabel: ["H", "C", "N", "O", "S", "P", "F", "Cl", "Br", "I"],
    MaxAtomsListSize: 15,
};
AtomConstants.SelectDistance = AtomConstants.HoverRadius + AtomConstants.HoverStrokeWidth / 2;
