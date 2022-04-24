//= =============================================================================
// Items
//= =============================================================================

//= =============================================================================
// Chemistry
//= =============================================================================

// Chemistry - Bond
export interface BondAttributes {
    type: number;
    // index of first connected atom
    atom_start_id: number;
    // index of second connected atom
    atom_end_id: number;
}

export enum BondType {
    SINGLE = 1,
    DOUBLE,
    TRIPLE,
    AROMATIC,
    ANY,
}

// Chemistry - Atom
export interface AtomAttributes {
    id: number;
    center: Point;
    charge: number;
    symbol: string;
}

//= =============================================================================
// State
//= =============================================================================
export interface ToolbarItemState {
    selectedToolbarItem: string;
}

export interface RootState {
    toolbarItem: ToolbarItemState;
}
//= =============================================================================
// API
//= =============================================================================

//= =============================================================================
// Events
//= =============================================================================

//= =============================================================================
// Default Types
//= =============================================================================
interface Point {
    x: number;
    y: number;
}
