import type { BondType } from "@constants/enum.constants";
import type { Number as SVGNumber, Rect, SVG, Svg } from "@svgdotjs/svg.js";
import Vector2 from "@utils/mathsTs/Vector2";

//= =============================================================================
// Items
//= =============================================================================

//= =============================================================================
// Chemistry
//= =============================================================================

// Chemistry - Bond
export interface BondAttributes {
    id: number;
    type: BondType;
    // index of first connected atom
    atomStartId: number;
    // index of second connected atom
    atomEndId: number;
}

export interface BondEditorContext {
    bondAttrs: BondAttributes;
    movedAtomId: number | undefined;
    // elem: Rect | undefined;
    canvas: Svg;
}

// Chemistry - Atom
export interface AtomAttributes {
    id: number;
    center: Vector2;
    charge: number;
    symbol: string;
    color: string;
}

export const DefaultAtomAttributes = {
    id: 999,
    symbol: "C",
    charge: 0,
    color: "#ffffff",
};

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
export interface MouseEventCallBackProperties {
    e: MouseEvent;
    canvas: Svg;
    mouseDownLocation: Vector2;
    mouseCurrentLocation: Vector2;
    mouseUpLocation?: Vector2;
}
export interface MouseEventCallBackResponse {
    shapes: any;
}
//= =============================================================================
// Default Types
//= =============================================================================
