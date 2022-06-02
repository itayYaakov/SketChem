/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType, LayersNames } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import type { Atom, Bond } from "@entities";
import type { NamedPoint, PointRBush } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { MouseEventCallBackProperties } from "@src/types";
import { LayersUtils } from "@src/utils/LayersUtils";
import { Circle } from "@svgdotjs/svg.js";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../../ToolbarItem";
import { RegisterToolbarWithName } from "../ToolsMapper.helper";

const { atomsTree, atomsMap, bondsTree, bondsMap } = EntitiesMapsStorage;

class DrawTree implements ActiveToolbarItem {
    tree: PointRBush;

    name: string;

    drawnCircles: Circle[];

    constructor(tree: PointRBush, isAtomTree: boolean) {
        if (isAtomTree) {
            this.name = "Atoms (debug)";
        } else {
            this.name = "Bonds (debug)";
        }
        this.tree = tree;
        this.drawnCircles = [];
    }

    onActivate() {
        if (this.drawnCircles.length > 0) {
            console.log("Debug tool remove", this.name);
            this.drawnCircles.forEach((circle) => circle.remove());
            this.drawnCircles = [];
            return;
        }

        let color = "#29cf03";
        let radius = 9;
        let map: Map<number, Atom | Bond> = bondsMap;
        if (this.name.endsWith("atoms (debug)")) {
            color = "#00a9f3";
            radius = 12;
            map = atomsMap;
        }

        let treesDup = 0;
        const treeDuplicateSet = new Set<string>();

        this.tree.all().forEach((node) => {
            const { x, y } = node.point;
            const entry = `x${(Math.round(x * 100) / 100).toFixed(3)}-y${(Math.round(y * 100) / 100).toFixed(3)}`;

            const circle = LayersUtils.getLayer(LayersNames.General).circle(radius).fill(color).cx(x).cy(y);

            if (treeDuplicateSet.has(entry)) {
                circle.stroke({ color: "red", width: 2 });
                treesDup += 1;
            }
            treeDuplicateSet.add(entry);
            this.drawnCircles.push(circle);
        });

        let mapDup = 0;
        const mapDuplicateSet = new Set<string>();

        map.forEach((node) => {
            const { x, y } = node.getCenter();
            const entry = `x${(Math.round(x * 100) / 100).toFixed(3)}-y${(Math.round(y * 100) / 100).toFixed(3)}`;
            const circle = LayersUtils.getLayer(LayersNames.General)
                .circle(radius * 0.2)
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
        console.log(`Find ${treesDup} duplicates in tree and ${mapDup} duplicates in map`);
    }
}

const atomsDrawTree = new DrawTree(atomsTree, true);
const bondsDrawTree = new DrawTree(bondsTree, false);

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

export { DrawAtoms, DrawBonds };
