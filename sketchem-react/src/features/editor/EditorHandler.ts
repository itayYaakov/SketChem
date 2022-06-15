import { EntityType, EntityVisualState } from "@constants/enum.constants";
import { actions } from "@features/chemistry/chemistrySlice";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { Atom, Bond, Entity } from "@src/entities";
import { ActionItem, ChemistryState, EntityEventContext, EntityEventsFunctions } from "@src/types";

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

    constructor(dispatch?: any) {
        console.log("I'm created editor handler!!");
        this.dispatch = dispatch;
        this.atomsMap = EntitiesMapsStorage.atomsMap;
        this.bondsMap = EntitiesMapsStorage.bondsMap;
        this.selectedAtoms = new Map<number, Atom>();
        this.selectedBonds = new Map<number, Bond>();
        this.copiedAtoms = new Map<number, Atom>();
        this.copiedBonds = new Map<number, Bond>();
    }

    setDispatch(dispatch: any) {
        this.dispatch = dispatch;
    }

    private createFullStateObject() {
        const result: ChemistryState = {
            atoms: [],
            bonds: [],
        };
        this.atomsMap.forEach((atom, id) => {
            result.atoms!.push({
                id,
                attributes: atom.getAttributes(),
            });
        });
        this.bondsMap.forEach((bond, id) => {
            result.bonds!.push({
                id,
                attributes: bond.getAttributes(),
            });
        });

        return result;
    }

    createHistoryUpdate() {
        const currentState = this.createFullStateObject();
        this.dispatch(actions.update_history_state(currentState));
    }

    editAtomsAndBondsBasedOnStateObject(state: ChemistryState) {
        let start = performance.now();

        const stateAtomsIds = new Set<number>();
        const stateBondsIds = new Set<number>();

        const ignoreBondsIds = state.bonds?.map((bond) => bond.id);

        state.atoms?.forEach((atom) => {
            stateAtomsIds.add(atom.id);
            if (this.atomsMap.has(atom.id)) {
                const entity = this.atomsMap.get(atom.id);
                entity?.updateAttributes(atom.attributes, ignoreBondsIds);
            } else {
                const entity = new Atom({
                    props: atom.attributes,
                });
            }
        });

        const end2 = performance.now();
        console.log(`editAtomsAndBondsBasedOnStateObject A took ${end2 - start} ms`);
        start = performance.now();

        state.bonds?.forEach((bond) => {
            stateBondsIds.add(bond.id);
            if (this.bondsMap.has(bond.id)) {
                const entity = this.bondsMap.get(bond.id);
                entity?.updateAttributes(bond.attributes);
            } else {
                const entity = new Bond({
                    props: bond.attributes,
                });
            }
        });

        this.atomsMap.forEach((atom, id) => {
            if (!stateAtomsIds.has(id)) {
                atom.destroy([], false);
            }
            atom.getOuterDrawCommand();
        });

        this.bondsMap.forEach((bond, id) => {
            if (!stateBondsIds.has(id)) {
                bond.destroy([], false);
            }
            bond.getOuterDrawCommand();
        });

        const end = performance.now();
        console.log(`editAtomsAndBondsBasedOnStateObject took ${end - start} ms`);
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
        return map.size;
    }

    applyFunctionToBonds(func: (bond: Bond) => void, onlySelected: boolean) {
        const map = onlySelected ? this.selectedBonds : this.bondsMap;
        map.forEach((entity) => {
            func(entity);
        });
        return map.size;
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
}
