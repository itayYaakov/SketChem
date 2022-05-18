/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
import { BondStereoKekule, BondType, LayersNames } from "@constants/enum.constants";
import { Atom, Bond } from "@entities";
import { itemsMaps } from "@features/shared/storage";
import { IdUtils } from "@src/utils/IdUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Circle, Path, PathArray, Rect } from "@svgdotjs/svg.js";
import { BondAttributes, BoundingBox, MouseEventCallBackProperties } from "@types";

import { ActiveToolbarItem } from "../ToolbarItem";

enum SelectionMode {
    Empty = -1,
    Single = 1,
    Multiple,
}

abstract class SelectTemplate implements ActiveToolbarItem {
    name: string;

    static selectedAtoms: Set<Atom>;

    static selectedBonds: Set<Bond>;

    keyboardKeys?: string[];

    minBoundingBoxPoint!: Vector2;

    maxBoundingBoxPoint!: Vector2;

    selectionMode: SelectionMode;

    constructor(name: string, keyboardKeys?: string[]) {
        this.name = name;
        this.keyboardKeys = keyboardKeys ?? undefined;
        SelectTemplate.selectedAtoms = new Set<Atom>();
        SelectTemplate.selectedBonds = new Set<Bond>();
        this.selectionMode = SelectionMode.Empty;
    }

    resetSelection() {
        this.unselectAll();
        SelectTemplate.selectedAtoms.clear();
        SelectTemplate.selectedBonds.clear();
    }

    unselectAll() {
        SelectTemplate.selectedAtoms.forEach((atom) => {
            atom.Select(false);
        });

        SelectTemplate.selectedBonds.forEach((bond) => {
            bond.Select(false);
        });
    }

    selectAtom(id: number) {
        const atom = Atom.getInstanceById(id);
        atom.Select(true);
        SelectTemplate.selectedAtoms.add(atom);
    }

    selectBond(id: number) {
        const bond = Bond.getInstanceById(id);
        bond.Select(true);
        SelectTemplate.selectedBonds.add(bond);
    }

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation, e } = eventHolder;

        const startTime = performance.now();
        // Retrieve all html elements in given mouse down location
        const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
        const endTime = performance.now();

        // exists on return true
        elementsAtPoint.some((elem) => {
            this.selectionMode = SelectionMode.Empty;

            if (elem.tagName === "svg") {
                return true;
            }

            const atomId = IdUtils.idIsOfAtomElem(elem.id);
            if (atomId) {
                this.resetSelection();

                this.selectionMode = SelectionMode.Single;
                this.selectAtom(atomId);
                return true;
            }
            const bondId = IdUtils.idIsOfBondElem(elem.id);
            if (bondId) {
                this.resetSelection();

                this.selectionMode = SelectionMode.Single;
                this.selectBond(bondId);
                return true;
            }

            return false;
        });

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

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        if (this.selectionMode === SelectionMode.Single) {
            return;
        }

        const { mouseCurrentLocation, mouseDownLocation } = eventHolder;

        // !!! for this.selectionMode === SelectionMode.Empty only

        if (this.selectionMode === SelectionMode.Empty) {
            this.minBoundingBoxPoint = mouseDownLocation.clone();
            this.maxBoundingBoxPoint = mouseDownLocation.clone();
            this.createShape(eventHolder);
            this.selectionMode = SelectionMode.Multiple;
        }

        this.setEdgePoints(eventHolder);

        this.updateShape(eventHolder);
        this.unselectAll();

        const boundingBox = {
            minX: this.minBoundingBoxPoint.x,
            minY: this.minBoundingBoxPoint.y,
            maxX: this.maxBoundingBoxPoint.x,
            maxY: this.maxBoundingBoxPoint.y,
        } as BoundingBox;

        const atomPointsInBoundingBox = itemsMaps.atoms.search(boundingBox);
        const bondsPointsInBoundingBox = itemsMaps.bonds.search(boundingBox);

        atomPointsInBoundingBox.forEach((element) => {
            if (!this.pointIsInShape(element.point.x, element.point.y, boundingBox)) return;
            this.selectAtom(element.id);
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

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        switch (this.selectionMode) {
            case SelectionMode.Empty:
                this.resetSelection();
                break;

            default:
                this.removeShape();
                break;
        }
    }

    onMouseLeave(eventHolder: MouseEventCallBackProperties) {
        switch (this.selectionMode) {
            case SelectionMode.Multiple:
                this.removeShape();
                break;

            default:
                break;
        }
    }

    abstract setEdgePoints(eventHolder: MouseEventCallBackProperties): void;

    abstract pointIsInShape(x: number, y: number, bBox: BoundingBox): boolean;

    abstract createShape(eventHolder: MouseEventCallBackProperties): void;

    abstract updateShape(eventHolder: MouseEventCallBackProperties): void;

    abstract removeShape(): void;
}

class SimpleSelect extends SelectTemplate {
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
        const diff = mouseCurrentLocation.sub(mouseDownLocation);
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

    pointIsInShape(x: number, y: number, bBox: BoundingBox) {
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
        const { mouseCurrentLocation, mouseDownLocation } = eventHolder;
        if (!this.path || !this.pathArray) return;

        this.polygon.push([mouseCurrentLocation.x, mouseCurrentLocation.y]);
        this.pathArray.push(["L", mouseCurrentLocation.x, mouseCurrentLocation.y]);
        this.path.plot(this.pathArray);
    }

    removeShape(): void {
        this.path?.remove();
    }
}

const simpleSelect = new SimpleSelect("Select", ["A"]);
const lassoSelect = new LassoSelect("Lasso Select", ["A"]);

export { lassoSelect, simpleSelect };
