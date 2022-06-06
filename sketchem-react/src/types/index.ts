import type { BondOrder, BondStereoKekule } from "@constants/enum.constants";
import type { Atom } from "@entities";
import type { Number as SVGNumber, Rect, SVG, Svg } from "@svgdotjs/svg.js";
import Vector2 from "@utils/mathsTs/Vector2";

//= =============================================================================
// Items
//= =============================================================================
export interface ActionItem {
    command: "ADD" | "CHANGE" | "REMOVE";
    type: "ATOM" | "BOND";
    atomAttributes?: AtomAttributes;
    bondAttributes?: BondAttributes;
}

// interface ActionItems {
//     commands: ActionItem[];
// }

//= =============================================================================
// Chemistry
//= =============================================================================

// Chemistry - Atom
export interface AtomAttributes {
    id: number;
    center: Vector2;
    charge: number;
    symbol: string;
    color: string;
}
export interface IAtom {
    nodeObj?: any;
    props?: Partial<AtomAttributes>;
}

// Chemistry - Bond
export interface BondAttributes {
    id: number;
    order: BondOrder;
    stereo: BondStereoKekule;
    // index of first connected atom
    atomStartId: number;
    // index of second connected atom
    atomEndId: number;
}

// Chemistry - Bond
export interface IBond {
    connectorObj?: any;
    props?: {
        order: BondOrder;
        stereo: BondStereoKekule;
        // index of first connected atom
        atomStartId: number;
        // index of second connected atom
        atomEndId: number;
        optionalId?: number;
    };
}

//= =============================================================================
// Actions Attributes
//= =============================================================================

export interface IAtomAttributes {
    readonly label: string;
    readonly color: string;
}

export interface IBondAttributes {
    readonly bondOrder: BondOrder;

    readonly bondStereo: BondStereoKekule;
}

export interface IChargeAttributes {
    readonly charge: number;
}

export type ToolbarItemButtonAttributes = IAtomAttributes | IBondAttributes | IChargeAttributes;

export const isIAtomAttributes = (o: ToolbarItemButtonAttributes): o is IAtomAttributes =>
    (o as IAtomAttributes).label !== undefined;

export const isIBondAttributes = (o: ToolbarItemButtonAttributes): o is IBondAttributes =>
    (o as IBondAttributes).bondOrder !== undefined;

export const isIChargeAttributes = (o: ToolbarItemButtonAttributes): o is IChargeAttributes =>
    (o as IChargeAttributes).charge !== undefined;

export interface ToolbarAction {
    button: string;
    // if pressed button has it's own attributes (like charge, atom label or bond order)
    attributes?: ToolbarItemButtonAttributes;
}

//= =============================================================================
// State
//= =============================================================================
// export interface BondMouseEventState {
//     eventType: string;
//     id: number;
// }

export interface LoadFileAction {
    content: string;
    format: string;
    replace?: boolean;
}
export interface SaveFileAction {
    format: string;
}

export interface FrequentAtoms {
    atoms: string[];
    currentAtom: string;
}

export interface ToolbarItemState {
    toolbarContext: ToolbarAction;
    dialogWindow: string;
    importContext: LoadFileAction;
    exportContext: SaveFileAction;
    frequentAtoms: FrequentAtoms;
    // bondMouseEvent: BondMouseEventState;
}
export interface ChemistryState {
    items: ActionItem[][];
}

export interface RootState {
    toolbarItem: ToolbarItemState;
    chemistry: ChemistryState;
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
    previousMouseLocation: Vector2;
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

export interface BoundingBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
