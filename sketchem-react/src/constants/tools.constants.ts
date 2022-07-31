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

export const ToolsShortcutsMapByShortcut = new Map<string, string[]>([
    ["1", [SubToolsNames.BondSingle]],
    ["2", [SubToolsNames.BondDouble]],
    ["3", [SubToolsNames.BondTriple]],
    ["4", [SubToolsNames.BondSingleOrDouble]],
    ["5", [SubToolsNames.BondWedgeFront]],
    ["6", [SubToolsNames.BondWedgeBack]],
    ["q", [ToolsNames.SelectBox]],
    ["w", [ToolsNames.SelectLasso]],
    ["e", [ToolsNames.Chain]],
    ["r", [ToolsNames.PeriodicTable]],
    ["z", [SubToolsNames.ChargeMinus]],
    ["x", [SubToolsNames.ChargePlus]],
    ["del, backspace, clear", [ToolsNames.Erase]],
    ["ctrl+s", [ToolsNames.Export]],
    ["ctrl+o", [ToolsNames.Import]],
    ["shift+n", [ToolsNames.Clear]],
    ["ctrl+c", [ToolsNames.Copy]],
    ["ctrl+v", [ToolsNames.Paste]],
    ["ctrl+z", [ToolsNames.Undo]],
    ["ctrl+y", [ToolsNames.Redo]],
    ["h", [createAtomSubToolName("H")]],
    ["c", [createAtomSubToolName("C")]],
    ["n", [createAtomSubToolName("N")]],
    ["o", [createAtomSubToolName("O")]],
    ["s", [createAtomSubToolName("S")]],
    ["p", [createAtomSubToolName("P")]],
    ["f", [createAtomSubToolName("F")]],
    ["i", [createAtomSubToolName("I")]],
]);

export const ToolsShortcutsMapByToolName: Map<string, string> = new Map<string, string>();

ToolsShortcutsMapByShortcut.forEach((toolsNames, shortcut) => {
    toolsNames.forEach((toolName) => {
        ToolsShortcutsMapByToolName.set(toolName, shortcut);
    });
});

export const getNextToolByShortcut = (shortcut: string, currentTool: string): string => {
    const tools = ToolsShortcutsMapByShortcut.get(shortcut);
    if (!tools) {
        return ToolsNames.Empty;
    }
    const index = tools.indexOf(currentTool);
    if (index === -1) {
        return tools[0];
    }
    return tools[(index + 1) % tools.length];
};

export const ValidMouseMoveDistance = 15;
