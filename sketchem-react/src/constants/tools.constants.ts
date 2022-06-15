import { ElementsData } from "./elements.constants";

export enum ToolsNames {
    Empty = "",
    Atom = "atom",
    Bond = "bond",
    Chain = "chain",
    Charge = "charge",
    Clear = "clear",
    Copy = "copy",
    Erase = "erase",
    Export = "export",
    Import = "import",
    Paste = "paste",
    PeriodicTable = "periodic_table",
    SelectBox = "select_box",
    SelectLasso = "select_lasso",
    Undo = "undo",
    Redo = "redo",
    DebugLoadExampleMol = "debug_load_example_mol",
    DebugDrawAtomTree = "debug_draw_atom_tree",
    DebugDrawBondTree = "debug_draw_bond_tree",
    DebugDrawAllPeriodic = "debug_draw_all_periodic",
    DebugExportMolToConsole = "debug_export_mol_to_console",
}

export enum SubToolsNames {
    BondSingle = "Single Bond",
    BondDouble = "Double Bond",
    BondTriple = "Triple Bond",
    BondAromatic = "Aromatic Bond",
    BondSingleOrDouble = "Single Or Double Bond",
    BondSingleOrAromatic = "Single Or Aromatic Bond",
    BondDoubleOrAromatic = "Double Or Aromatic Bond",
    BondAny = "Any Bond",
    BondWedgeFront = "Wedge Bond (Front)",
    BondWedgeBack = "Wedge Bond (Back)",
    BondUpOrDown = "Up Or Down Bond",
    BondCis = "Cis Bond",
    BondTrans = "Trans Bond",
    ChargeMinus = "Minus Charge",
    ChargePlus = "Plus Charge",
}

export function createAtomSubToolName(label: string) {
    return `${label} Atom`;
}

export const ValidMouseMoveDistance = 30;
