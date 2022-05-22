import { EntityType } from "@constants/enum.constants";
import type { Atom, Bond } from "@entities";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Svg } from "@svgdotjs/svg.js";
import RBush from "rbush";

import { mergeArrays } from "./oldRbushKnn";
import knn, { INode } from "./rbushKnn";

export interface NamedPoint {
    id: number;
    point: Vector2;
    entityType: EntityType;
}
class PointRBush extends RBush<NamedPoint> {
    toBBox(v: NamedPoint) {
        return { minX: v.point.x, minY: v.point.y, maxX: v.point.x, maxY: v.point.y };
    }

    compareMinX(a: NamedPoint, b: NamedPoint) {
        return a.point.x - b.point.x;
    }

    compareMinY(a: NamedPoint, b: NamedPoint) {
        return a.point.y - b.point.y;
    }

    equals(a: NamedPoint, b: NamedPoint) {
        return a.id === b.id;
    }

    remove(item: NamedPoint) {
        return super.remove(item, this.equals);
    }
}

// maximum number of entries in a tree node. 9 (used by default) is a reasonable
// choice for most applications.Higher value means faster insertion and slower search,
// and vice versa
const ENTRIES_AMOUNT = 7;
const atomsTree = new PointRBush(ENTRIES_AMOUNT);
const bondsTree = new PointRBush(ENTRIES_AMOUNT);

const atomsMap = new Map<number, Atom>();
const bondsMap = new Map<number, Bond>();

function getMapInstanceById<Type>(map: Map<number, Type>, idNum: number): Type {
    const entity = map.get(idNum);
    if (!entity) {
        throw new Error(`Couldn't find entity with id ${idNum}`);
    }
    return entity;
}

function knnFromMultipleMaps(
    trees: RBush<any>[],
    point: Vector2,
    n?: number,
    maxDistances?: number[],
    predicate?: (c: any) => boolean
) {
    const treeResults: INode[][] = [];
    let index = 0;
    trees.forEach((tree) => {
        const maxDistance = maxDistances ? maxDistances[index] : undefined;
        const treeResult = knn(tree, point.x, point.y, n, maxDistance, predicate);
        treeResults.push(treeResult);
        index += 1;
    });
    const result = mergeArrays(treeResults, n);
    return result;
}

export const EntitiesMapsStorage = {
    atomsTree,
    bondsTree,
    atomsMap,
    bondsMap,
    getMapInstanceById,
    knn,
    knnFromMultipleMaps,
};
