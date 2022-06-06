/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
import { AtomConstants } from "@constants/atom.constants";
import { BondConstants } from "@constants/bond.constants";
import { EntityType, LayersNames } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import type { NamedPoint } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Path, PathArray, Rect } from "@svgdotjs/svg.js";
import { BoundingBox, MouseEventCallBackProperties } from "@types";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../ToolbarItem";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

enum SelectionMode {
    Empty = -1,
    Single = 1,
    Multiple,
}

interface IAnchor {
    atomId: number | undefined;
    bondId: number | undefined;
    pivot: Vector2 | undefined;
}
interface IMovesItem {
    movedBondsId: number[];
    shouldMoveAtoms: Set<Atom>;
    shouldMoveBonds: Set<Bond>;
}
interface IAtomMergeAction {
    replacingAtom: Atom;
    replacedAtom: Atom;
}

abstract class SelectTemplate implements ActiveToolbarItem {
    private static selectedAtoms: Map<number, Atom>;

    private static selectedBonds: Map<number, Bond>;

    minBoundingBoxPoint!: Vector2;

    maxBoundingBoxPoint!: Vector2;

    selectionMode: SelectionMode;

    anchor!: IAnchor;

    movesItem?: IMovesItem;

    mergeAtomsAction: IAtomMergeAction[];

    constructor() {
        SelectTemplate.selectedAtoms = new Map<number, Atom>();
        SelectTemplate.selectedBonds = new Map<number, Bond>();
        this.selectionMode = SelectionMode.Empty;
        this.resetAnchor();
        this.mergeAtomsAction = [];
        this.movesItem = undefined;
    }

    getSelectedBonds() {
        return SelectTemplate.selectedBonds;
    }

    getSelectedAtoms() {
        return SelectTemplate.selectedAtoms;
    }

    unselectAll() {
        SelectTemplate.selectedAtoms.forEach((atom) => {
            // console.log("Unselect Atom id=", atom.getId());
            atom.select(false);
        });

        SelectTemplate.selectedBonds.forEach((bond) => {
            bond.select(false);
        });
    }

    resetAnchor() {
        this.anchor = {
            atomId: undefined,
            bondId: undefined,
            pivot: undefined,
        };
        this.movesItem = undefined;
        this.mergeAtomsAction = [];
    }

    calculateDeltaFromAnchor(mouse: Vector2) {
        let delta: Vector2;
        const atomAnchorId = this.anchor.atomId;
        const bondAnchorId = this.anchor.bondId;

        let anchorObject: Atom | Bond | undefined;

        if (atomAnchorId) {
            anchorObject = SelectTemplate.selectedAtoms.get(atomAnchorId);
        } else if (bondAnchorId) {
            anchorObject = SelectTemplate.selectedBonds.get(bondAnchorId);
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

    resetSelection() {
        // console.log("K1 this.selectedAtoms =", SelectTemplate.selectedAtoms);
        this.unselectAll();
        SelectTemplate.selectedAtoms.clear();
        SelectTemplate.selectedBonds.clear();
        // console.log("K2 this.selectedAtoms =", SelectTemplate.selectedAtoms);
    }

    selectAtom(id: number) {
        const atom = EntitiesMapsStorage.getAtomById(id);
        atom.select(true);
        // console.log("Selected Atom id=", id);
        SelectTemplate.selectedAtoms.set(id, atom);
    }

    selectBond(id: number) {
        const bond = EntitiesMapsStorage.getBondById(id);
        bond.select(true);
        SelectTemplate.selectedBonds.set(id, bond);
    }

    resetMergedAtoms() {
        this.mergeAtomsAction.forEach((action) => {
            const { replacingAtom, replacedAtom } = action;
            replacedAtom.hover(false);
        });
        this.mergeAtomsAction = [];
    }

    movedAtomOverAnotherAtomByAtom(atom?: Atom, point?: Vector2) {
        if (!atom) return false;
        const center = point ?? atom.getAttributes().center;
        const { getAtomById, atomAtPoint } = EntitiesMapsStorage;

        const ignoreAtomList = [atom.getId()];
        const atomWasPressed = atomAtPoint(center, ignoreAtomList);
        if (atomWasPressed) {
            const replacedAtom = getAtomById(atomWasPressed.id);
            replacedAtom.hover(true);
            console.log("A this.mergeAtomsAction.push. size=", this.mergeAtomsAction.length);
            this.mergeAtomsAction.push({ replacedAtom, replacingAtom: atom });
            console.log("B this.mergeAtomsAction.push. size=", this.mergeAtomsAction.length);
            return true;
        }
        return false;
    }

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation } = eventHolder;

        const atomMaxDistance = AtomConstants.SelectDistance;
        const bondMaxDistance = BondConstants.SelectDistance;
        const NeighborsToFind = 1;
        const { atomsTree, bondsTree, knnFromMultipleMaps } = EntitiesMapsStorage;

        // !! can be removed later
        const startTime = performance.now();

        const closetSomethings = knnFromMultipleMaps([atomsTree, bondsTree], mouseDownLocation, NeighborsToFind, [
            atomMaxDistance,
            bondMaxDistance,
        ]);
        const [closest] = closetSomethings;
        if (closest) {
            const closestNode = closest.node as NamedPoint;
            console.log("closest.dist", closest.dist, "type=", EntityType[closestNode.entityType]);

            if (closestNode.entityType === EntityType.Atom) {
                const atomId = closestNode.id;
                this.selectionMode = SelectionMode.Single;
                this.resetAnchor();
                this.anchor.atomId = atomId;

                if (!SelectTemplate.selectedAtoms.has(atomId)) {
                    this.resetSelection();
                    this.selectAtom(atomId);
                }
            } else if (closestNode.entityType === EntityType.Bond) {
                const bondId = closestNode.id;
                this.selectionMode = SelectionMode.Single;
                this.resetAnchor();
                this.anchor.bondId = bondId;

                if (!SelectTemplate.selectedBonds.has(bondId)) {
                    this.resetSelection();
                    this.selectBond(bondId);
                }
            }
        } else {
            this.selectionMode = SelectionMode.Empty;
            this.resetSelection();
        }

        // !! can be removed later
        const endTime = performance.now();
        console.log("took=", endTime - startTime, "ms");
        console.log("this.selectionMode=", SelectionMode[this.selectionMode]);

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

    calculateMultipleAtomsAndBondsToMove(): IMovesItem {
        let shouldMoveAtomsIds = new Set<number>(Array.from(SelectTemplate.selectedAtoms.keys()));
        let shouldMoveBondsIds = new Set<number>(Array.from(SelectTemplate.selectedBonds.keys()));

        SelectTemplate.selectedBonds.forEach((bond) => {
            const connectedAtoms = bond.getConnectedAtomsIds();
            shouldMoveAtomsIds = new Set([...shouldMoveAtomsIds, ...connectedAtoms]);
        });

        SelectTemplate.selectedAtoms.forEach((atom) => {
            const connectedBonds = atom.getConnectedBondsIds();
            shouldMoveBondsIds = new Set([...shouldMoveBondsIds, ...connectedBonds]);
        });

        const movedBondsId: number[] = [];

        shouldMoveBondsIds.forEach((bond) => {
            movedBondsId.push(bond);
        });

        const shouldMoveAtoms = new Set<Atom>();
        const shouldMoveBonds = new Set<Bond>();

        shouldMoveAtomsIds.forEach((atomId) => {
            const { atomsMap } = EntitiesMapsStorage;
            const atom = EntitiesMapsStorage.getAtomById(atomId);
            shouldMoveAtoms.add(atom);
            // atom.moveByDelta(delta, movedBondsId);
        });

        shouldMoveBondsIds.forEach((bondId) => {
            const bond = EntitiesMapsStorage.getBondById(bondId);
            shouldMoveBonds.add(bond);
            // bond.moveByDelta(delta, false);
        });

        return {
            movedBondsId,
            shouldMoveAtoms,
            shouldMoveBonds,
        } as IMovesItem;
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        const { mouseCurrentLocation, previousMouseLocation, mouseDownLocation } = eventHolder;
        const distance = mouseCurrentLocation.distance(mouseDownLocation);
        // console.log("distance=", distance);

        if (distance < ToolsConstants.ValidMouseMoveDistance) {
            return;
        }

        if (this.selectionMode === SelectionMode.Single) {
            const selectedAtomsSize = SelectTemplate.selectedAtoms.size;
            const selectedBondsSize = SelectTemplate.selectedBonds.size;
            const onlyOneAtom = selectedAtomsSize === 1 && selectedBondsSize === 0;
            const onlyOneBond = selectedAtomsSize === 0 && selectedBondsSize === 1;

            if (onlyOneAtom) {
                SelectTemplate.selectedAtoms.forEach((atom) => {
                    atom.updateAttributes({ center: mouseCurrentLocation });
                });
            } else if (onlyOneBond) {
                SelectTemplate.selectedBonds.forEach((bond) => {
                    bond.moveTo(mouseCurrentLocation);
                });
            }

            const delta = this.calculateDeltaFromAnchor(mouseCurrentLocation);

            this.resetMergedAtoms();
            this.movesItem = this.movesItem ?? this.calculateMultipleAtomsAndBondsToMove();
            const { shouldMoveAtoms, shouldMoveBonds, movedBondsId } = this.movesItem;

            shouldMoveAtoms.forEach((atom) => {
                atom.moveByDelta(delta, movedBondsId);
                this.movedAtomOverAnotherAtomByAtom(atom);
            });

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
        this.resetSelection();

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
            this.selectAtom(element.id);
            // console.log("B this.selectedAtoms =", SelectTemplate.selectedAtoms);
        });

        bondsPointsInBoundingBox.forEach((element) => {
            if (!this.pointIsInShape(element.point.x, element.point.y, boundingBox)) return;
            this.selectBond(element.id);
        });

        // for testing
        // this.arrayy.forEach((cir) => {
        //     cir.fill("#ff00aa");
        //     if (!this.IsPointInPolygon(Number(cir.x().valueOf()), Number(cir.y().valueOf()), this.polygon)) return;
        //     // if (!import pointInPolygon from "point-in-polygon";([Number(cir.x().valueOf()), Number(cir.y().valueOf())], this.polygon)) return;
        //     cir.fill("#00ff00");
        // });
    }

    cancel(eventHolder: MouseEventCallBackProperties) {
        // !!! is there special treatment for delete selection tool
        this.mergeNodes();
        this.doAction();
        switch (this.selectionMode) {
            case SelectionMode.Empty:
                this.resetSelection();
                break;

            default:
                this.removeShape();
                break;
        }
    }

    mergeNodes() {
        this.mergeAtomsAction.forEach((action) => {
            const { replacingAtom, replacedAtom } = action;
            replacingAtom.mergeWith(replacedAtom);
        });
        this.mergeAtomsAction = [];
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        this.cancel(eventHolder);
    }

    onMouseLeave(eventHolder: MouseEventCallBackProperties) {
        this.cancel(eventHolder);
    }

    abstract setEdgePoints(eventHolder: MouseEventCallBackProperties): void;

    abstract pointIsInShape(x: number, y: number, bBox: BoundingBox): boolean;

    abstract createShape(eventHolder: MouseEventCallBackProperties): void;

    abstract updateShape(eventHolder: MouseEventCallBackProperties): void;

    abstract removeShape(): void;

    doAction(): void {}
}

export class BoxSelect extends SelectTemplate {
    rect: Rect | undefined;

    setEdgePoints(eventHolder: MouseEventCallBackProperties) {
        const { mouseCurrentLocation, mouseDownLocation } = eventHolder;

        this.minBoundingBoxPoint = Vector2.min(mouseDownLocation, mouseCurrentLocation);
        this.maxBoundingBoxPoint = Vector2.max(mouseDownLocation, mouseCurrentLocation);
    }

    pointIsInShape(x: number, y: number, bBox: BoundingBox) {
        return true;
    }

    createShape(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation } = eventHolder;
        this.rect = LayersUtils.getLayer(LayersNames.Selection)
            .rect(0, 0)
            .move(mouseDownLocation.x, mouseDownLocation.y)
            .fill({ color: "#5cdfdd", opacity: 0.3 })
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

    removeShape(): void {
        this.rect?.remove();
    }
}

class LassoSelect extends SelectTemplate {
    path: Path | undefined;

    polygon: number[][] = [[]];

    pathArray: PathArray | undefined;

    setEdgePoints(eventHolder: MouseEventCallBackProperties) {
        const { mouseCurrentLocation, mouseDownLocation } = eventHolder;
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
            .fill({ color: "#5cdfdd", opacity: 0.3 })
            .stroke({ color: "#000000", opacity: 0.9, width: 3, dasharray: "4" });
    }

    updateShape(eventHolder: MouseEventCallBackProperties): void {
        const { mouseCurrentLocation } = eventHolder;
        if (!this.path || !this.pathArray) return;

        this.polygon.push([mouseCurrentLocation.x, mouseCurrentLocation.y]);
        this.pathArray.push(["L", mouseCurrentLocation.x, mouseCurrentLocation.y]);
        this.path.plot(this.pathArray);
    }

    removeShape(): void {
        this.path?.remove();
    }
}

const boxSelectTool = new BoxSelect();
const lassoSelectTool = new LassoSelect();

// !!!! delete later !! not needed
export { boxSelectTool };

RegisterToolbarWithName(ToolsConstants.ToolsNames.SelectBox, boxSelectTool);
RegisterToolbarWithName(ToolsConstants.ToolsNames.SelectLasso, lassoSelectTool);

const boxSelect = new SimpleToolbarItemButtonBuilder("Box Select", ToolsConstants.ToolsNames.SelectBox, ["A"]);
const lassoSelect = new SimpleToolbarItemButtonBuilder("Lasso Select", ToolsConstants.ToolsNames.SelectLasso, ["A"]);

export { lassoSelect, boxSelect as simpleSelect };
