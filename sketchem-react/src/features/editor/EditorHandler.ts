import { EntityType, EntityVisualState } from "@constants/enum.constants";
import { EntitiesMapsStorage } from "@features/shared/storage";
import type { Atom, Bond, Entity } from "@src/entities";
import { ActionItem, EntityEventContext, EntityEventsFunctions } from "@src/types";

let currentHistoryHolder: ActionItem[] = [];

interface EntityMaps {
    selected: Map<number, Entity>;
    map: Map<number, Entity>;
}

export class EditorHandler {
    dispatch: any;

    atomsMap: Map<number, Atom>;

    bondsMap: Map<number, Bond>;

    selectedAtoms: Map<number, Atom>;

    selectedBonds: Map<number, Bond>;

    hovered?: Entity | Atom | Bond;

    anchor?: Entity | Atom | Bond;

    copiedAtoms: Map<number, Atom>;

    copiedBonds: Map<number, Bond>;

    constructor(dispatch: any) {
        this.dispatch = dispatch;
        this.atomsMap = EntitiesMapsStorage.atomsMap;
        this.bondsMap = EntitiesMapsStorage.bondsMap;
        this.selectedAtoms = new Map<number, Atom>();
        this.selectedBonds = new Map<number, Bond>();
        this.copiedAtoms = new Map<number, Atom>();
        this.copiedBonds = new Map<number, Bond>();
    }

    addHistoryItem(historyItem: ActionItem) {
        currentHistoryHolder.push(historyItem);
    }

    setEventListenersForAtoms(event?: EntityEventsFunctions) {
        this.atomsMap.forEach((atom) => {
            atom.setListeners(event);
        });
    }

    private isHovered() {
        return this.hovered?.visualState === EntityVisualState.Hover;
    }

    getHoveredAtom(): Atom | undefined {
        const candidate = this.hovered;
        if (candidate && candidate.myType === EntityType.Atom) {
            // temporal hack - since we cant import Atom and use instance of
            if (this.isHovered()) return candidate as Atom;
        }
        return undefined;
    }

    getHoveredBond(): Bond | undefined {
        const candidate = this.hovered;
        if (candidate && candidate.myType === EntityType.Bond) {
            // temporal hack - since we cant import Atom and use instance of
            if (this.isHovered()) return candidate as Bond;
        }
        return undefined;
    }

    setEventListenersForBonds(event?: EntityEventsFunctions) {
        this.bondsMap.forEach((bond) => {
            bond.setListeners(event);
        });
    }

    updateCopiedContents() {
        this.copiedAtoms = new Map(this.selectedAtoms);
        this.copiedBonds = new Map(this.selectedBonds);
        // make sure both start and end atoms of bonds are copied
        this.copiedBonds.forEach((bond) => {
            const { startAtom } = bond;
            const { endAtom } = bond;
            if (startAtom && !this.copiedAtoms.has(startAtom.getId())) {
                this.copiedAtoms.set(startAtom.getId(), startAtom);
            }
            if (endAtom && !this.copiedAtoms.has(endAtom.getId())) {
                this.copiedAtoms.set(endAtom.getId(), endAtom);
            }
        });
    }

    resetCopiedContents() {
        this.copiedAtoms.clear();
        this.copiedBonds.clear();
    }

    getMaps(type: EntityType): EntityMaps {
        switch (type) {
            case EntityType.Atom:
                return {
                    selected: this.selectedAtoms,
                    map: this.atomsMap,
                };
            default:
                return {
                    selected: this.selectedBonds,
                    map: this.bondsMap,
                };
        }
    }

    setHoverModeForEntities(mode: boolean, color?: string) {
        if (mode) {
            this.hovered?.setVisualState(EntityVisualState.Hover, color);
        } else if (this.isHovered()) {
            this.hovered?.setVisualState(EntityVisualState.None, color);
        }

        if (!mode) {
            this.hovered = undefined;
        }
    }

    applyFunctionToAtoms(func: (atom: Atom) => void, onlySelected: boolean) {
        const map = onlySelected ? this.selectedAtoms : this.atomsMap;
        map.forEach((entity) => {
            func(entity);
        });
    }

    applyFunctionToBonds(func: (bond: Bond) => void, onlySelected: boolean) {
        const map = onlySelected ? this.selectedBonds : this.bondsMap;
        map.forEach((entity) => {
            func(entity);
        });
    }

    resetSelectedAtoms() {
        this.applyFunctionToAtoms((atom) => {
            atom.setVisualState(EntityVisualState.None);
        }, false);
        this.selectedAtoms.clear();
    }

    resetSelectedBonds() {
        this.applyFunctionToBonds((bond) => {
            bond.setVisualState(EntityVisualState.None);
        }, false);
        this.selectedBonds.clear();
    }

    addAtomToSelected(atom: Atom, color?: string) {
        this.selectedAtoms.set(atom.getId(), atom);
        atom.setVisualState(EntityVisualState.Select, color);
    }

    addBondToSelected(bond: Bond, color?: string) {
        this.selectedBonds.set(bond.getId(), bond);
        bond.setVisualState(EntityVisualState.Select, color);
    }

    setHoverModeForAtoms(mode: boolean) {
        this.setHoverModeForEntities(mode);
    }

    setHoverModeForBonds(mode: boolean) {
        this.setHoverModeForEntities(mode);
    }

    setHoverMode(mode: boolean, atoms: boolean, bonds: boolean, color?: string) {
        this.setEventListenersForAtoms();
        this.setEventListenersForBonds();

        if (!mode) {
            // ???? should delete previous?
            if (atoms) this.setHoverModeForEntities(false);
            if (bonds) this.setHoverModeForEntities(false);
            this.hovered = undefined;
            return;
        }

        const hoverHandler: EntityEventsFunctions = {
            onMouseEnter: (e: Event, data: EntityEventContext) => {
                const { id, type } = data;
                const maps = this.getMaps(type);
                const entity = maps.map.get(id);
                if (!entity || (this.hovered === entity && this.isHovered()) || maps.selected.has(id)) {
                    this.anchor = entity;
                    return;
                }
                if (this.hovered) this.setHoverModeForEntities(false, color);
                this.hovered = entity;
                this.anchor = this.hovered;
                this.setHoverModeForEntities(true, color);
            },
            onMouseLeave: (e: Event, data: EntityEventContext) => {
                const { id, type } = data;
                const maps = this.getMaps(type);
                const entity: Entity | undefined = maps.map.get(id);
                if (!entity || maps.selected.has(id)) {
                    this.anchor = undefined;
                    return;
                }
                this.setHoverModeForEntities(false, color);
                entity.setVisualState(EntityVisualState.None, color);
                this.hovered = undefined;
                this.anchor = this.hovered;
            },
        };

        if (atoms) {
            this.setEventListenersForAtoms(hoverHandler);
        }
        if (bonds) {
            this.setEventListenersForBonds(hoverHandler);
        }
    }

    drawAll() {
        this.atomsMap.forEach((atom) => {
            atom.getOuterDrawCommand();
        });
        // !!! also for bonds
    }

    sealHistory() {
        // There's a problem with center beeing unserialized
        // this.dispatch!(actions.update_history(currentHistoryHolder));
        currentHistoryHolder = [];
    }
}
