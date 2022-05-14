export enum Direction {
    Top = 1,
    Bottom,
    Left,
    Right,
}

export enum MouseButtons {
    None = 0,
    Left = 1,
    Right = 2,
    Scroll = 4,
    Back = 8,
    Forward = 16,
}

export enum BondType {
    Single = 1,
    Double = 2,
    Triple = 3,
    Aromatic = 4,
    SingleOrDouble = 5,
    SingleOrAromatic = 6,
    DoubleOrAromatic = 7,
    Any = 8,
    WedgeFront = 50,
    WedgeBack = 50,
}

export enum BondStereo {
    // for single
    None = 0,
    Up = 1,
    Either = 4,
    Down = 6,
    // for double
    // XYZ = 0,
    CisOrTrans = 3,
}

// Real Mol -> Kekule
// 0->0
// 1->1
// 3->0   - missing!!
// 4->8
// 6->3
// export enum BondStereoKekule {
//     // for single
//     None = 0,
//     Up = 1,
//     Either = 8,
//     Down = 3,
//     // for double
//     // XYZ = 0,
//     CisOrTrans = 12, // a mistake, not available in kekule?
// }

export const BondStereoKekuleMap = new Map<number, number>([
    [0, 0],
    [1, 1],
    [3, 0],
    [4, 8],
    [6, 3],
]);

// WedgeBack,
