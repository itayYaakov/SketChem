/* eslint-disable max-classes-per-file */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType, EntityVisualState, LayersNames } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { EditorHandler } from "@features/editor/EditorHandler";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Path, PathArray, Rect } from "@svgdotjs/svg.js";
import { BoundingBox, EntityEventContext, EntityEventsFunctions, MouseEventCallBackProperties } from "@types";

import { ActiveToolbarItem, LaunchAttrs, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

enum SelectionMode {
    Empty = -1,
    Single = 1,
    Multiple,
}

interface IAnchor {
    atomId: number | undefined;
    bondId: number | undefined;
}
interface IMovesItem {
    shouldMoveAtomsIds: Set<number>;
    shouldMoveBondsIds: Set<number>;
    shouldMoveAtoms: Set<Atom>;
    shouldMoveBonds: Set<Bond>;
}

export interface IAtomMergeAction {
    replacingAtom: Atom;
    replacedAtom: Atom;
}

abstract class SelectTemplate implements ActiveToolbarItem {
    minBoundingBoxPoint!: Vector2;

    maxBoundingBoxPoint!: Vector2;

    selectionMode: SelectionMode;

    anchor!: IAnchor;

    movesItem?: IMovesItem;

    mergeAtomsAction: IAtomMergeAction[];

    pressedAtomAnchor: Atom | undefined;

    pressedBondAnchor: Bond | undefined;

    selectColor?: string = undefined;

    shapeFillColor: string = "#000000";

    dragged: boolean = false;

    constructor() {
        this.selectionMode = SelectionMode.Empty;
        this.resetAnchor();
        this.mergeAtomsAction = [];
        this.movesItem = undefined;
    }

    onDeactivate() {
        this.selectionMode = SelectionMode.Empty;
        this.resetAnchor();
        this.mergeAtomsAction = [];
        this.movesItem = undefined;

        this.removeShape();
    }

    onActivate(attrs?: LaunchAttrs) {
        if (!attrs) return;
        const { editor } = attrs;
        if (!editor) {
            throw new Error("SelectTemplate.onActivate: missing attributes or editor");
        }
        editor.setHoverMode(true, true, true, this.selectColor);
    }

    unselectAll(editor: EditorHandler) {
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
    }

    resetAnchor() {
        this.anchor = {
            atomId: undefined,
            bondId: undefined,
        };
    }

    calculateDeltaFromAnchor(mouse: Vector2, editor: EditorHandler): Vector2 {
        let delta: Vector2;
        const atomAnchorId = this.anchor.atomId;
        const bondAnchorId = this.anchor.bondId;

        let anchorObject: Atom | Bond | undefined;

        if (atomAnchorId) {
            anchorObject = editor.selectedAtoms.get(atomAnchorId);
        } else if (bondAnchorId) {
            anchorObject = editor.selectedBonds.get(bondAnchorId);
        }

        if (!anchorObject) {
            delta = Vector2.zero();
            console.error("Is this possible?", delta.x, delta.y);
            return delta;
        }

        const anchorCenter = anchorObject.getCenter();
        delta = mouse.subNew(anchorCenter);
        return delta;
    }

    selectAtom(id: number, editor: EditorHandler) {
        const atom = EntitiesMapsStorage.getAtomById(id);
        editor.addAtomToSelected(atom, this.selectColor);
    }

    selectBond(id: number, editor: EditorHandler) {
        const bond = EntitiesMapsStorage.getBondById(id);
        editor.addBondToSelected(bond, this.selectColor);
    }

    resetMergedAtoms() {
        this.mergeAtomsAction.forEach((action) => {
            const { replacedAtom } = action;
            replacedAtom.setVisualState(EntityVisualState.None);
        });
        this.mergeAtomsAction = [];
    }

    searchAnAtomToMergeWith(atom: Atom, ignoreAtomsList: number[]): Atom | undefined {
        const center = atom.getCenter();
        const { atomsMap } = EntitiesMapsStorage;

        let atomWasPressed: Atom | undefined;
        let minimumDistance = Number.MAX_VALUE;

        // find closet minimum distance atom
        atomsMap.forEach((mAtom, id) => {
            if (ignoreAtomsList.includes(id)) return;
            const atomCenter = mAtom.getCenter();
            const distance = center.distance(atomCenter);
            if (distance < minimumDistance) {
                minimumDistance = distance;
                atomWasPressed = mAtom;
            }
        });

        if (atomWasPressed && minimumDistance < AtomConstants.SelectDistance) {
            const replacedAtom = atomWasPressed;
            if (!replacedAtom) return undefined;
            replacedAtom.setVisualState(EntityVisualState.Merge);
            // console.log("A this.mergeAtomsAction.push. size=", this.mergeAtomsAction.length);
            this.mergeAtomsAction.push({ replacedAtom, replacingAtom: atom });
            // console.log("B this.mergeAtomsAction.push. size=", this.mergeAtomsAction.length);
            return replacedAtom;
        }
        return undefined;
    }

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        const { editor } = eventHolder;

        this.dragged = false;
        this.movesItem = undefined;
        this.mergeAtomsAction = [];

        const tempAnchor = eventHolder.editor.anchor;

        let atom = eventHolder.editor.getHoveredAtom();
        if (!(atom && atom.isAlive) && tempAnchor && tempAnchor instanceof Atom) atom = tempAnchor;
        if (!(atom && atom.isAlive) && this.pressedAtomAnchor?.isAlive()) atom = this.pressedAtomAnchor;

        let bond = eventHolder.editor.getHoveredBond();
        if (!(atom && atom.isAlive) && tempAnchor && tempAnchor instanceof Bond) bond = tempAnchor;
        if (!(bond && bond.isAlive()) && this.pressedBondAnchor?.isAlive()) bond = this.pressedBondAnchor;

        if (atom && atom.isAlive()) {
            const atomId = atom.getId();
            this.selectionMode = SelectionMode.Single;
            this.resetAnchor();
            this.anchor.atomId = atomId;

            if (!editor.selectedAtoms.has(atomId)) {
                this.unselectAll(editor);
                this.selectAtom(atomId, editor);
            }
        } else if (bond && bond.isAlive()) {
            const bondId = bond.getId();
            this.selectionMode = SelectionMode.Single;
            this.resetAnchor();
            this.anchor.bondId = bondId;

            if (!editor.selectedBonds.has(bondId)) {
                this.unselectAll(editor);
                this.selectBond(bondId, editor);
            }
        } else {
            this.selectionMode = SelectionMode.Empty;
            this.unselectAll(editor);
        }

        // for testing:
        // const { mouseDownLocation, canvas } = eventHolder;
        // if (this.arrayy === undefined) {
        //     this.arrayy = Array(200).fill(undefined);
        //     const viewBox = canvas.viewbox();
        //     for (let index = 0; index < 200; index += 1) {
        //         const x = viewBox.x + Math.floor(Math.random() * viewBox.width);
        //         const y = viewBox.y + Math.floor(Math.random() * viewBox.height);
        //         this.arrayy[index] = canvas.circle(10).fill("#ff00aa").move(x, y);
        //     }
        // }
    }

    calculateMultipleAtomsAndBondsToMove(editor: EditorHandler): IMovesItem {
        let shouldMoveAtomsIds = new Set<number>(Array.from(editor.selectedAtoms.keys()));
        let shouldMoveBondsIds = new Set<number>(Array.from(editor.selectedBonds.keys()));

        editor.applyFunctionToAtoms((atom) => {
            const connectedBonds = atom.getConnectedBondsIds();
            shouldMoveBondsIds = new Set([...shouldMoveBondsIds, ...connectedBonds]);
        }, true);

        editor.applyFunctionToBonds((bond) => {
            const connectedAtoms = bond.getConnectedAtomsIds();
            shouldMoveAtomsIds = new Set([...shouldMoveAtomsIds, ...connectedAtoms]);
        }, true);

        const shouldMoveAtoms = new Set<Atom>();
        const shouldMoveBonds = new Set<Bond>();

        shouldMoveAtomsIds.forEach((atomId) => {
            const atom = EntitiesMapsStorage.getAtomById(atomId);
            shouldMoveAtoms.add(atom);
        });

        shouldMoveBondsIds.forEach((bondId) => {
            const bond = EntitiesMapsStorage.getBondById(bondId);
            shouldMoveBonds.add(bond);
        });

        return {
            shouldMoveAtomsIds,
            shouldMoveBondsIds,
            shouldMoveAtoms,
            shouldMoveBonds,
        } as IMovesItem;
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        const { mouseCurrentLocation, editor, mouseDownLocation } = eventHolder;
        const distance = mouseCurrentLocation.distance(mouseDownLocation);
        // console.log("distance=", distance);

        if (this.selectionMode !== SelectionMode.Empty) {
            // disable hover effect for both atoms and bonds
            const hoverHandler: EntityEventsFunctions = {
                onMouseEnter: (e: Event, data: EntityEventContext) => {
                    const { id, type } = data;
                    if (type === EntityType.Atom) {
                        this.pressedAtomAnchor = EntitiesMapsStorage.getAtomById(id);
                    } else if (type === EntityType.Bond) {
                        this.pressedBondAnchor = EntitiesMapsStorage.getBondById(id);
                    }
                },
                onMouseLeave: (e: Event, data: EntityEventContext) => {
                    const { id, type } = data;
                    if (type === EntityType.Atom) {
                        if (this.pressedAtomAnchor === EntitiesMapsStorage.getAtomById(id)) {
                            this.pressedAtomAnchor = undefined;
                        }
                    } else if (type === EntityType.Bond) {
                        if (this.pressedBondAnchor === EntitiesMapsStorage.getBondById(id)) {
                            this.pressedBondAnchor = undefined;
                        }
                    }
                },
            };
            editor.setEventListenersForAtoms(hoverHandler);
            editor.setEventListenersForBonds(hoverHandler);
        }

        if (distance < ToolsConstants.ValidMouseMoveDistance) {
            return;
        }

        if (this.selectionMode === SelectionMode.Single) {
            const selectedAtomsSize = editor.selectedAtoms.size;
            const selectedBondsSize = editor.selectedBonds.size;
            const onlyOneAtom = selectedAtomsSize === 1 && selectedBondsSize === 0;
            const onlyOneBond = selectedAtomsSize === 0 && selectedBondsSize === 1;

            if (onlyOneAtom) {
                editor.applyFunctionToAtoms((atom) => {
                    atom.updateAttributes({ center: mouseCurrentLocation.get() });
                }, true);
            } else if (onlyOneBond) {
                editor.applyFunctionToBonds((bond) => {
                    bond.moveTo(mouseCurrentLocation);
                }, true);
            }

            const delta = this.calculateDeltaFromAnchor(mouseCurrentLocation, editor);

            this.resetMergedAtoms();
            this.movesItem = this.movesItem ?? this.calculateMultipleAtomsAndBondsToMove(editor);
            const { shouldMoveAtomsIds, shouldMoveBondsIds, shouldMoveAtoms, shouldMoveBonds } = this.movesItem;

            const alreadyMergesAtoms: number[] = Array.from(shouldMoveAtomsIds);
            const shouldMoveBondsIdsArray = Array.from(shouldMoveBondsIds);
            // performance.mark("beforeMergeAtoms");
            shouldMoveAtoms.forEach((atom) => {
                atom.moveByDelta(delta, shouldMoveBondsIdsArray);
                const newMergedAtom = this.searchAnAtomToMergeWith(atom, alreadyMergesAtoms);
                if (newMergedAtom) alreadyMergesAtoms.push(newMergedAtom.getId());
            });
            // performance.mark("afterMergeAtoms");
            // console.log(performance.measure("mergeAtoms", "beforeMergeAtoms", "afterMergeAtoms"));

            shouldMoveBonds.forEach((bond) => {
                bond.moveByDelta(delta, false);
            });

            return;
        }

        // !!! for this.selectionMode === SelectionMode.Empty only

        if (this.selectionMode === SelectionMode.Empty) {
            this.minBoundingBoxPoint = mouseDownLocation.clone();
            this.maxBoundingBoxPoint = mouseDownLocation.clone();
            this.createShape(eventHolder);
            this.selectionMode = SelectionMode.Multiple;
        }

        this.setEdgePoints(eventHolder);

        this.updateShape(eventHolder);
        this.unselectAll(editor);

        const boundingBox = {
            minX: this.minBoundingBoxPoint.x,
            minY: this.minBoundingBoxPoint.y,
            maxX: this.maxBoundingBoxPoint.x,
            maxY: this.maxBoundingBoxPoint.y,
        } as BoundingBox;

        const atomPointsInBoundingBox = EntitiesMapsStorage.atomsTree.search(boundingBox);
        const bondsPointsInBoundingBox = EntitiesMapsStorage.bondsTree.search(boundingBox);

        atomPointsInBoundingBox.forEach((element) => {
            if (!this.pointIsInShape(element.point.x, element.point.y, boundingBox)) return;
            // console.log("Selected from B");
            this.selectAtom(element.id, editor);
            // console.log("B this.selectedAtoms =", SelectTemplate.selectedAtoms);
        });

        bondsPointsInBoundingBox.forEach((element) => {
            if (!this.pointIsInShape(element.point.x, element.point.y, boundingBox)) return;
            this.selectBond(element.id, editor);
        });

        // for testing
        // this.arrayy.forEach((cir) => {
        //     cir.fill("#ff00aa");
        //     if (!this.IsPointInPolygon(Number(cir.x().valueOf()), Number(cir.y().valueOf()), this.polygon)) return;
        //     // if (!import pointInPolygon from "point-in-polygon";([Number(cir.x().valueOf()), Number(cir.y().valueOf())], this.polygon)) return;
        //     cir.fill("#00ff00");
        // });
    }

    mergeNodes() {
        this.mergeAtomsAction.forEach((action) => {
            const { replacingAtom, replacedAtom } = action;
            replacingAtom.mergeWith(replacedAtom);
        });
        this.mergeAtomsAction = [];
    }

    perform(eventHolder: MouseEventCallBackProperties) {
        const { editor } = eventHolder;
        // !!! is there special treatment for delete selection tool
        this.mergeNodes();
        this.doAction(editor);
        this.pressedAtomAnchor = undefined;
        this.pressedBondAnchor = undefined;

        if (this.movesItem && (this.movesItem.shouldMoveAtoms.size > 0 || this.movesItem.shouldMoveBonds.size > 0)) {
            editor.createHistoryUpdate();
        }

        switch (this.selectionMode) {
            case SelectionMode.Empty:
                this.unselectAll(editor);
                this.resetAnchor();
                break;

            default:
                this.removeShape();
                break;
        }
        editor.setHoverMode(true, true, true, this.selectColor);
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        this.perform(eventHolder);
    }

    onMouseLeave(eventHolder: MouseEventCallBackProperties) {
        this.perform(eventHolder);
    }

    abstract setEdgePoints(eventHolder: MouseEventCallBackProperties): void;

    abstract pointIsInShape(x: number, y: number, bBox: BoundingBox): boolean;

    abstract createShape(eventHolder: MouseEventCallBackProperties): void;

    abstract updateShape(eventHolder: MouseEventCallBackProperties): void;

    abstract isThereShape(): boolean;

    abstract removeShape(): void;

    abstract doAction(...params: any): void;
}

export class BoxSelect extends SelectTemplate {
    rect: Rect | undefined;

    shapeFillColor: string = "#5cdfdd";

    setEdgePoints(eventHolder: MouseEventCallBackProperties) {
        const { mouseCurrentLocation, mouseDownLocation } = eventHolder;

        this.minBoundingBoxPoint = Vector2.min(mouseDownLocation, mouseCurrentLocation);
        this.maxBoundingBoxPoint = Vector2.max(mouseDownLocation, mouseCurrentLocation);
    }

    pointIsInShape() {
        return true;
    }

    createShape(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation } = eventHolder;
        this.rect = LayersUtils.getLayer(LayersNames.Selection)
            .rect(0, 0)
            .move(mouseDownLocation.x, mouseDownLocation.y)
            .fill({ color: this.shapeFillColor, opacity: 0.3 })
            .stroke({ color: "#000000", opacity: 0.9, width: 3, dasharray: "4" });
    }

    updateShape(eventHolder: MouseEventCallBackProperties): void {
        if (!this.rect) return;
        const { mouseCurrentLocation, mouseDownLocation } = eventHolder;
        const diff = mouseCurrentLocation.subNew(mouseDownLocation);
        const width = Math.abs(diff.x);
        const height = Math.abs(diff.y);

        // if rectangle end point coordinates are smaller the start point
        if (diff.x < 0 || diff.y < 0) {
            const newX = Math.min(mouseDownLocation.x, mouseCurrentLocation.x);
            const newY = Math.min(mouseDownLocation.y, mouseCurrentLocation.y);
            this.rect.move(newX, newY);
        }

        this.rect.width(width).height(height);
    }

    isThereShape(): boolean {
        return this.rect !== undefined;
    }

    removeShape(): void {
        this.rect?.remove();
        this.rect = undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    doAction(_: any): void {}
}

class LassoSelect extends SelectTemplate {
    path: Path | undefined;

    polygon: number[][] = [[]];

    pathArray: PathArray | undefined;

    shapeFillColor: string = "#5cdfdd";

    setEdgePoints(eventHolder: MouseEventCallBackProperties) {
        const { mouseCurrentLocation } = eventHolder;
        this.minBoundingBoxPoint.minSelf(mouseCurrentLocation);
        this.maxBoundingBoxPoint.maxSelf(mouseCurrentLocation);
    }

    pointIsInPolygon(x: number, y: number, poly: number[][]) {
        const size = poly.length;
        let j = size - 1;
        let inside = false;
        for (let i = 0; i < size; i += 1) {
            if (x === poly[i][0] && y === poly[i][1]) {
                return true;
            }
            let slope = 0;
            if (poly[i][1] > y !== poly[j][1] > y) {
                slope = (x - poly[i][0]) * (poly[j][1] - poly[i][1]) - (poly[j][0] - poly[i][0]) * (y - poly[i][1]);
                if (slope === 0) {
                    return true;
                }
                if (slope < 0 !== poly[j][1] < poly[i][1]) {
                    inside = !inside;
                }
            }
            j = i;
        }
        return inside;
    }

    pointIsInShape(x: number, y: number) {
        return this.pointIsInPolygon(x, y, this.polygon);
    }

    createShape(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation } = eventHolder;
        this.pathArray = new PathArray([["M", mouseDownLocation.x, mouseDownLocation.y]]);
        this.polygon = [[mouseDownLocation.x, mouseDownLocation.y]];
        this.path?.remove();
        this.path = LayersUtils.getLayer(LayersNames.Selection)
            .path(this.pathArray)
            .attr({ "fill-rule": "evenodd" })
            .fill({ color: this.shapeFillColor, opacity: 0.3 })
            .stroke({ color: "#000000", opacity: 0.9, width: 3, dasharray: "4" });
    }

    updateShape(eventHolder: MouseEventCallBackProperties): void {
        const { mouseCurrentLocation } = eventHolder;
        if (!this.path || !this.pathArray) return;

        this.polygon.push([mouseCurrentLocation.x, mouseCurrentLocation.y]);
        this.pathArray.push(["L", mouseCurrentLocation.x, mouseCurrentLocation.y]);
        this.path.plot(this.pathArray);
    }

    isThereShape(): boolean {
        return this.path !== undefined;
    }

    removeShape(): void {
        this.path?.remove();
        this.path = undefined;
    }

    doAction(): void {}
}

const boxSelectTool = new BoxSelect();
const lassoSelectTool = new LassoSelect();

RegisterToolbarWithName(ToolsConstants.ToolsNames.SelectBox, boxSelectTool);
RegisterToolbarWithName(ToolsConstants.ToolsNames.SelectLasso, lassoSelectTool);

const boxSelect = new SimpleToolbarItemButtonBuilder(
    "Box Select",
    ToolsConstants.ToolsNames.SelectBox,
    ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.ToolsNames.SelectBox)
);
const lassoSelect = new SimpleToolbarItemButtonBuilder(
    "Lasso Select",
    ToolsConstants.ToolsNames.SelectLasso,
    ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.ToolsNames.SelectLasso)
);

RegisterToolbarButtonWithName(boxSelect);
RegisterToolbarButtonWithName(lassoSelect);

export { lassoSelect, boxSelect as simpleSelect };
