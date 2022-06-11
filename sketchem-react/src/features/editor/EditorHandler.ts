import { EntityType, EntityVisualState } from "@constants/enum.constants";
import { EntitiesMapsStorage } from "@features/shared/storage";
import type { Atom, Bond, Entity } from "@src/entities";
import { ActionItem, EntityEventContext, EntityEventsFunctions } from "@src/types";

let currentHistoryHolder: ActionItem[] = [];

interface EntityMaps {
    hover: Map<number, Entity>;
    selected: Map<number, Entity>;
    map: Map<number, Entity>;
}

export class EditorHandler {
    dispatch: any;

    atomsMap: Map<number, Atom>;

    bondsMap: Map<number, Bond>;

    selectedAtoms: Map<number, Atom>;

    selectedBonds: Map<number, Bond>;

    hoveredAtom: Map<number, Atom>;

    hoveredBond: Map<number, Bond>;

    constructor(dispatch: any) {
        this.dispatch = dispatch;
        this.atomsMap = EntitiesMapsStorage.atomsMap;
        this.bondsMap = EntitiesMapsStorage.bondsMap;
        this.selectedAtoms = new Map();
        this.selectedBonds = new Map();
        this.hoveredAtom = new Map();
        this.hoveredBond = new Map();
    }

    addHistoryItem(historyItem: ActionItem) {
        currentHistoryHolder.push(historyItem);
    }

    setEventListenersForAtoms(event?: EntityEventsFunctions) {
        this.atomsMap.forEach((atom) => {
            atom.setListeners(event);
        });
    }

    getHoveredAtom(): Atom | undefined {
        return this.hoveredAtom.values().next().value;
    }

    getHoveredBond(): Bond | undefined {
        return this.hoveredBond.values().next().value;
    }

    setEventListenersForBonds(event?: EntityEventsFunctions) {
        this.bondsMap.forEach((bond) => {
            bond.setListeners(event);
        });
    }

    getMaps(type: EntityType): EntityMaps {
        switch (type) {
            case EntityType.Atom:
                return {
                    hover: this.hoveredAtom,
                    selected: this.selectedAtoms,
                    map: this.atomsMap,
                };
            default:
                return {
                    hover: this.hoveredBond,
                    selected: this.selectedBonds,
                    map: this.bondsMap,
                };
        }
    }

    setHoverModeForEntities(mode: boolean, hoverMap: Map<number, Entity>, color?: string) {
        hoverMap.forEach((entity) => {
            if (mode) {
                entity.setVisualState(EntityVisualState.Hover, color);
            } else {
                entity.setVisualState(EntityVisualState.None, color);
            }
        });

        if (!mode) {
            hoverMap.clear();
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
        this.setHoverModeForEntities(mode, this.hoveredAtom);
    }

    setHoverModeForBonds(mode: boolean) {
        this.setHoverModeForEntities(mode, this.hoveredBond);
    }

    setHoverMode(mode: boolean, atoms: boolean, bonds: boolean, color?: string) {
        this.setEventListenersForAtoms();
        this.setEventListenersForBonds();

        if (!mode) {
            // ???? should delete previous?
            if (atoms) this.setHoverModeForEntities(false, this.hoveredAtom);
            if (bonds) this.setHoverModeForEntities(false, this.hoveredBond);
            this.hoveredAtom.clear();
            this.hoveredBond.clear();
            return;
        }

        const hoverHandler: EntityEventsFunctions = {
            onMouseEnter: (e: Event, data: EntityEventContext) => {
                const { id, type } = data;
                const maps = this.getMaps(type);
                // const entity: Atom | Bond | undefined = maps.map.get(id);
                const entity = maps.map.get(id);
                if (!entity || maps.hover.has(id)) return;
                if (maps.hover?.size > 0) this.setHoverModeForEntities(false, maps.hover, color);
                maps.hover.set(id, entity);
                this.setHoverModeForEntities(true, maps.hover, color);
            },
            onMouseLeave: (e: Event, data: EntityEventContext) => {
                const { id, type } = data;
                const maps = this.getMaps(type);
                const entity: Entity | undefined = maps.map.get(id);
                if (!entity || !maps.hover.has(id)) return;
                entity.setVisualState(EntityVisualState.None, color);
                maps.hover.clear();
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
