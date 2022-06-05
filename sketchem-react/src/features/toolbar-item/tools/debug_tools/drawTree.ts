/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { ElementsData } from "@constants/elements.constants";
import { EntityType, LayersNames } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import type { NamedPoint, PointRBush } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { IAtom, MouseEventCallBackProperties } from "@src/types";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Circle } from "@svgdotjs/svg.js";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../../ToolbarItem";
import { RegisterToolbarWithName } from "../ToolsMapper.helper";

const { atomsTree, atomsMap, bondsTree, bondsMap } = EntitiesMapsStorage;

class DrawTree implements ActiveToolbarItem {
    tree: PointRBush;

    radius: number;

    drawnCircles: Circle[];

    color: string;

    map: Map<number, Atom | Bond>;

    constructor(tree: PointRBush, color: string, radius: number, map: Map<number, Atom | Bond>) {
        this.tree = tree;
        this.drawnCircles = [];
        this.map = map;
        this.radius = radius;
        this.color = color;
    }

    onActivate() {
        if (this.drawnCircles.length > 0) {
            this.drawnCircles.forEach((circle) => circle.remove());
            this.drawnCircles = [];
            return;
        }

        let treesDup = 0;
        let treesSize = 0;
        const treeDuplicateSet = new Set<string>();

        this.tree.all().forEach((node) => {
            treesSize += 1;
            const { x, y } = node.point;
            const entry = `x${(Math.round(x * 100) / 100).toFixed(3)}-y${(Math.round(y * 100) / 100).toFixed(3)}`;

            const circle = LayersUtils.getLayer(LayersNames.General).circle(this.radius).fill(this.color).cx(x).cy(y);

            if (treeDuplicateSet.has(entry)) {
                circle.stroke({ color: "red", width: 2 });
                treesDup += 1;
            }
            treeDuplicateSet.add(entry);
            this.drawnCircles.push(circle);
        });

        let mapDup = 0;
        const mapDuplicateSet = new Set<string>();

        this.map.forEach((node) => {
            const { x, y } = node.getCenter();
            const entry = `x${(Math.round(x * 100) / 100).toFixed(3)}-y${(Math.round(y * 100) / 100).toFixed(3)}`;
            const circle = LayersUtils.getLayer(LayersNames.General)
                .circle(this.radius * 0.2)
                .fill("#ffffff")
                // .opacity(0.3)
                .cx(x)
                .cy(y);
            if (mapDuplicateSet.has(entry)) {
                circle.stroke({ color: "black", width: 1 });
                mapDup += 1;
            }
            mapDuplicateSet.add(entry);

            this.drawnCircles.push(circle);
        });
        console.log(
            `Found ${treesDup}/${treesSize} duplicates in tree and ${mapDup}/${this.map.size} duplicates in map`
        );
    }
}

const atomsDrawTree = new DrawTree(atomsTree, "#29cf03", 9, atomsMap);
const bondsDrawTree = new DrawTree(bondsTree, "#00a9f3", 12, bondsMap);

RegisterToolbarWithName(ToolsConstants.ToolsNames.DebugDrawAtomTree, atomsDrawTree);
RegisterToolbarWithName(ToolsConstants.ToolsNames.DebugDrawBondTree, bondsDrawTree);

const DrawAtoms = new SimpleToolbarItemButtonBuilder(
    "draw atoms (debug)",
    ToolsConstants.ToolsNames.DebugDrawAtomTree,
    ["A"]
);
const DrawBonds = new SimpleToolbarItemButtonBuilder(
    "draw bonds (debug) ",
    ToolsConstants.ToolsNames.DebugDrawBondTree,
    ["A"]
);

export default [DrawAtoms, DrawBonds];
