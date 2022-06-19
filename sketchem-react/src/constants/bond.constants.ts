import type { IBondCache } from "@src/types";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { PathArray } from "@svgdotjs/svg.js";

import { LayersNames } from "./enum.constants";

const BondPadding = 16;
const HalfBondPadding = BondPadding / 2;
const BondWedgeStroke = 2;
const BondWedgeBarsPadding = 4;

// There's a problem to apply an svg gradient to path with x or y delta of 0
const deltaNoise = 0.0001;

const createBondWedgeBackPointsArray = (cache: IBondCache) => {
    const length = cache.distance;
    const sectors = 2 * Math.round(length / (BondWedgeBarsPadding + BondWedgeStroke) / 2);
    const pointArray: any = [];

    const tempX = cache.startPosition.x;
    const tempY = cache.startPosition.y;

    console.log("distance", length, "sectors", sectors);

    for (let i = 1; i <= sectors; i += 1) {
        const tempBarHeight = (i / sectors) * BondPadding;
        const tempPoint = {
            x: tempX + (i / sectors) * length,
            y1: tempY - tempBarHeight / 2,
            y2: tempY + tempBarHeight / 2,
        };

        pointArray.push(["M", tempPoint.x, tempPoint.y1]);
        pointArray.push(["V", tempPoint.y2]);
    }

    const pathArray: PathArray = new PathArray(pointArray);
    return pathArray;
};

const createBondWedgeFrontPointsArray = (cache: IBondCache) => {
    const pointArray: any[] = [];

    const dx = HalfBondPadding * Math.cos(-cache.angleRad);
    const dy = HalfBondPadding * Math.sin(-cache.angleRad);

    pointArray.push(["M", cache.startPosition.x, cache.startPosition.y]);
    pointArray.push(["L", cache.endPosition.x - dx, cache.endPosition.y + dy]);
    pointArray.push(["L", cache.endPosition.x + dx, cache.endPosition.y - dy]);
    pointArray.push(["Z"]);

    const pathArray = new PathArray(pointArray);
    return pathArray;
};

const findParallelLinePoints = (cache: IBondCache, distance: number) => {
    const delta = cache.endPosition.subNew(cache.startPosition).normalize();
    const length = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    const dx = delta.x / length;
    const dy = delta.y / length;

    const nx = dy;
    const ny = -dx;

    return {
        x3: cache.startPosition.x + distance * nx,
        y3: cache.startPosition.y + distance * ny,
        x4: cache.endPosition.x + distance * nx,
        y4: cache.endPosition.y + distance * ny,
    };
};

const createRegularBondPointsArray = (cache: IBondCache, lines: 1 | 2 | 3) => {
    const pointArray: any[] = [];
    let noise = 0;
    if (cache.angleDeg % 90 === 0) {
        noise = deltaNoise;
    }

    if (lines === 1 || lines === 3) {
        pointArray.push(["M", cache.startPosition.x, cache.startPosition.y]);
        pointArray.push(["L", cache.endPosition.x + noise, cache.endPosition.y + noise]);
    }

    if (lines === 2 || lines === 3) {
        let distance = HalfBondPadding * 0.8;
        if (lines === 2) distance /= 2;

        const dx = distance * Math.cos(-cache.angleRad);
        const dy = distance * Math.sin(-cache.angleRad);

        pointArray.push(["M", cache.startPosition.x - dx, cache.startPosition.y + dy]);
        pointArray.push(["L", cache.endPosition.x - dx, cache.endPosition.y + dy]);
        pointArray.push(["M", cache.startPosition.x + dx, cache.startPosition.y - dy]);
        pointArray.push(["L", cache.endPosition.x + dx, cache.endPosition.y - dy]);
    }

    const pathArray = new PathArray(pointArray);
    return pathArray;
};

export const BondConstants = {
    padding: BondPadding,
    wedgeStroke: BondWedgeStroke,
    createRegularBondPointsArray,
    createBondWedgeBackPointsArray,
    createBondWedgeFrontPointsArray,
    poly_clip_id: "poly_bond",
    hoverFilter: "bond_hover",
    SelectDistance: 10,
};
