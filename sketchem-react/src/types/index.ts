import type { BondOrder, BondStereoKekule, EntityType } from "@constants/enum.constants";
import type { EditorHandler } from "@features/editor/EditorHandler";
import Vector2 from "@utils/mathsTs/Vector2";
import { StateWithHistory } from "redux-undo";

//= =============================================================================
// Items
//= =============================================================================
export interface EntityEventContext {
    id: number;
    type: EntityType;
}
export interface EntityEventsFunctions {
    onMouseEnter?: (e: Event, data: EntityEventContext) => void;
    onMouseDown?: (e: Event, data: EntityEventContext) => void;
    onMouseMove?: (e: Event, data: EntityEventContext) => void;
    onMouseUp?: (e: Event, data: EntityEventContext) => void;
    onMouseClick?: (e: Event, data: EntityEventContext) => void;
    onMouseLeave?: (e: Event, data: EntityEventContext) => void;
}
//= =============================================================================
// Chemistry
//= =============================================================================

// Chemistry - Atom
export interface AtomAttributes {
    id: number;
    center: {
        x: number;
        y: number;
    };
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
    props?: Partial<BondAttributes>;
}

export type EntityAttributes = AtomAttributes | BondAttributes;

export type IEntity = IAtom | IBond;

//= =============================================================================
// Chemistry Undo Redo
//= =============================================================================

interface AtomState {
    id: number;
    attributes: AtomAttributes;
}
interface BondState {
    id: number;
    attributes: BondAttributes;
}

// export interface ChemistryFullState {
export interface ChemistryState {
    atoms?: AtomState[];
    bonds?: BondState[];
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

export interface IBondCache {
    startPosition: Vector2;
    endPosition: Vector2;
    startPositionCloser: Vector2;
    endPositionCloser: Vector2;
    color1: string;
    color2: string;
    angleRad: number;
    angleDeg: number;
    distance: number;
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
    toolName: string;
    subToolName?: string;
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
}
export interface RootState {
    toolbarItem: ToolbarItemState;
    chemistry: StateWithHistory<ChemistryState>;
}
//= =============================================================================
// API
//= =============================================================================

//= =============================================================================
// Events
//= =============================================================================
export interface MouseEventCallBackProperties {
    e: MouseEvent;
    editor: EditorHandler;
    previousMouseLocation: Vector2;
    mouseDownLocation: Vector2;
    mouseCurrentLocation: Vector2;
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
