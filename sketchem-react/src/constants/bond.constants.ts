import type { IBondCache } from "@src/types";
import { PathArray } from "@svgdotjs/svg.js";

const BondPadding = 16;
const SmallerBondPadding = BondPadding * 0.7;
const HoverSelectPadding = BondPadding * 1.2;
const HalfBondPadding = BondPadding * 0.5;
const BondWedgeStroke = 2;
const BondWedgeBarsPadding = 4;

// There's a problem to apply an svg gradient to path with x or y delta of 0
const deltaNoise = 0.001;

const createBondWedgeBackPointsArray = (cache: IBondCache) => {
    const length = cache.distance;
    const sectors = 2 * Math.round(length / (BondWedgeBarsPadding + BondWedgeStroke) / 2);
    const pointArray: any = [];

    const tempX = cache.startPosition.x;
    const tempY = cache.startPosition.y;

    // for (let i = 1; i <= sectors; i += 1) {
    for (let i = 0; i <= sectors; i += 1) {
        const tempBarHeight = (i / sectors) * SmallerBondPadding;
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

    const dx = HalfBondPadding * Math.cos(-cache.angleRad) * 0.7;
    const dy = HalfBondPadding * Math.sin(-cache.angleRad) * 0.7;

    pointArray.push(["M", cache.startPosition.x, cache.startPosition.y]);
    pointArray.push(["L", cache.endPosition.x - dx, cache.endPosition.y + dy]);
    pointArray.push(["L", cache.endPosition.x + dx, cache.endPosition.y - dy]);
    pointArray.push(["Z"]);

    const pathArray = new PathArray(pointArray);
    return pathArray;
};

const createRegularBondPointsArray = (cache: IBondCache, lines: 1 | 2 | 3) => {
    const pointArray: any[] = [];
    let noise = 0;
    if (Math.abs(cache.angleDeg % 90) < 0.00001) {
        noise = deltaNoise;
    }

    if (lines === 1 || lines === 3) {
        pointArray.push(["M", cache.startPosition.x, cache.startPosition.y]);
        pointArray.push(["L", cache.endPosition.x + noise, cache.endPosition.y + noise]);
    }

    if (lines === 2 || lines === 3) {
        let distance = HalfBondPadding;
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

const createSingleOrDoubleBondPointsArrays = (cache: IBondCache) => {
    const pointArrays: any[][] = [[], []];
    let noise = 0;
    if (Math.abs(cache.angleDeg % 90) < 0.00001) {
        noise = deltaNoise;
    }

    pointArrays[0].push(["M", cache.startPosition.x, cache.startPosition.y]);
    pointArrays[0].push(["L", cache.endPosition.x + noise, cache.endPosition.y + noise]);
    const distance = HalfBondPadding * 0.8;

    const dx = distance * Math.cos(-cache.angleRad);
    const dy = distance * Math.sin(-cache.angleRad);

    pointArrays[1].push(["M", cache.startPositionCloser.x - dx, cache.startPositionCloser.y + dy]);
    pointArrays[1].push(["L", cache.endPositionCloser.x - dx, cache.endPositionCloser.y + dy]);
    pointArrays[1].push(["M", cache.startPositionCloser.x + dx, cache.startPositionCloser.y - dy]);
    pointArrays[1].push(["L", cache.endPositionCloser.x + dx, cache.endPositionCloser.y - dy]);

    // const closerStartPosition = Vector2.midpoint(cache.startPosition, cache.endPosition, 0.25);
    // const closerEndPosition = Vector2.midpoint(cache.startPosition, cache.endPosition, 0.75);

    // pointArrays[1].push(["M", closerStartPosition.x - dx, closerStartPosition.y + dy]);
    // pointArrays[1].push(["L", closerEndPosition.x - dx, closerEndPosition.y + dy]);
    // pointArrays[1].push(["M", closerStartPosition.x + dx, closerStartPosition.y - dy]);
    // pointArrays[1].push(["L", closerEndPosition.x + dx, closerEndPosition.y - dy]);

    const pathArrays = [new PathArray(pointArrays[0]), new PathArray(pointArrays[1])];
    return pathArrays;
};

export const BondConstants = {
    padding: BondPadding,
    HoverSelectPadding,
    wedgeStroke: BondWedgeStroke,
    createRegularBondPointsArray,
    createSingleOrDoubleBondPointsArrays,
    createBondWedgeBackPointsArray,
    createBondWedgeFrontPointsArray,
    poly_clip_id: "poly_bond",
    hoverFilter: "bond_hover",
    SelectDistance: 10,
};
