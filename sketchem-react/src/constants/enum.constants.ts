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

export enum MouseEventsNames {
    onClick = "click",
    onContextMenu = "contextmenu",
    onDoubleClick = "doubleclick",
    onDrag = "drag",
    onDragEnd = "dragend",
    onDragEnter = "dragenter",
    onDragExit = "dragexit",
    onDragLeave = "dragleave",
    onDragOver = "dragover",
    onDragStart = "dragstart",
    onDrop = "drop",
    onMouseDown = "mousedown",
    onMouseEnter = "mouseenter",
    onMouseLeave = "mouseleave",
    onMouseMove = "mousemove",
    onMouseOut = "mouseout",
    onMouseOver = "mouseover",
    onMouseUp = "mouseup",
}

export enum LayersNames {
    Root = "root",
    AtomLabelBackground = "atom_label_background",
    BondHover = "bond_hover",
    Bond = "bond",
    AtomHover = "atom_hover",
    AtomValenceError = "atom_valence_error",
    AtomLabelLabel = "atom_label_label",
    General = "general",
    Selection = "selection",
}

export enum EntityVisualState {
    None = 1,
    Hover,
    Select,
    AnimatedClick,
    Merge,
}

export enum MouseMode {
    Default = -1,
    EmptyPress = 1,
    AtomPressed,
    BondPressed,
}

export enum BondOrder {
    Single = 1,
    Double = 2,
    Triple = 3,
    Aromatic = 4,
    SingleOrDouble = 5,
    SingleOrAromatic = 6,
    DoubleOrAromatic = 7,
    Any = 8,
}

export enum EntityType {
    Atom = 1,
    Bond = 2,
}

export enum EntityLifeStage {
    New = 1,
    Initialized = 2,
    DestroyInit = 3,
    Destroyed = 4,
}

export enum BondStereoMol {
    // export enum BondStereo {
    // for single
    NONE = 0,
    UP = 1,
    UP_OR_DOWN = 4,
    DOWN = 6,
    // for double
    // XYZ = 0,
    CIS_OR_TRANS = 3,
}

// export enum KekuleBondStereo = {
export enum BondStereoKekule {
    /** A bond for which there is no stereochemistry. */
    NONE = 0,
    /** A bond pointing up of which the start atom is the stereocenter and
     * the end atom is above the drawing plane. */
    UP = 1,
    /** A bond pointing up of which the end atom is the stereocenter and
     * the start atom is above the drawing plane. */
    UP_INVERTED = 2,
    /** A bond pointing down of which the start atom is the stereocenter
     * and the end atom is below the drawing plane. */
    DOWN = 3,
    /** A bond pointing down of which the end atom is the stereocenter and
     * the start atom is below the drawing plane. */
    DOWN_INVERTED = 4,
    /** A bond for which there is stereochemistry, we just do not know
     *  if it is UP or DOWN. The start atom is the stereocenter.
     */
    UP_OR_DOWN = 8,
    /** A bond for which there is stereochemistry, we just do not know
     *  if it is UP or DOWN. The end atom is the stereocenter.
     */
    UP_OR_DOWN_INVERTED = 9,
    /** A bond is closer to observer than papaer, often used in ring structures. */
    CLOSER = 10,
    /** Indication that this double bond has a fixed, but unknown E/Z
     * configuration.
     */
    E_OR_Z = 20,
    /** Indication that this double bond has a E configuration.
     */
    E = 21,
    /** Indication that this double bond has a Z configuration.
     */
    Z = 22,
    /** Indication that this double bond has a fixed configuration, defined
     * by the 2D and/or 3D coordinates.
     */
    E_Z_BY_COORDINATES = 23,
    /** Indication that this double bond has a fixed, but unknown cis/trans
     * configuration.
     */
    CIS_OR_TRANS = 30,
    /** Indication that this double bond has a Cis configuration.
     */
    CIS = 31,
    /** Indication that this double bond has a Trans configuration.
     */
    TRANS = 32,
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

// /**
//  * Get inverted stereo direction value.
//  * @param {Int} direction
//  * @returns {Int}
//  */
// getInvertedDirection: function(direction)
// {
// 	var S = Kekule.BondStereo;
// 	switch (direction)
// 	{
// 		case S.UP: return S.UP_INVERTED;
// 		case S.UP_INVERTED: return S.UP;
// 		case S.DOWN: return S.DOWN_INVERTED;
// 		case S.DOWN_INVERTED: return S.DOWN;
// 		case S.UP_OR_DOWN: return S.UP_OR_DOWN_INVERTED;
// 		default:
// 			return direction;
// 	}
// }

// WedgeBack,
