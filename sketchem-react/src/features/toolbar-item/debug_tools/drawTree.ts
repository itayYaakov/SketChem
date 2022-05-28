/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { EntityType, LayersNames } from "@constants/enum.constants";
import type { Atom, Bond } from "@entities";
import type { NamedPoint, PointRBush } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { MouseEventCallBackProperties } from "@src/types";
import { LayersUtils } from "@src/utils/LayersUtils";
import { Circle } from "@svgdotjs/svg.js";

import { ActiveToolbarItem } from "../ToolbarItem";

const { atomsTree, atomsMap, bondsTree, bondsMap } = EntitiesMapsStorage;

class DrawTree implements ActiveToolbarItem {
    name: string;

    keyboardKeys?: string[];

    tree: PointRBush;

    drawnCircles: Circle[];

    constructor(name: string, tree: PointRBush, keyboardKeys?: string[]) {
        this.name = name;
        this.keyboardKeys = keyboardKeys ?? undefined;
        this.tree = tree;
        this.drawnCircles = [];
    }

    onMouseClick(eventHolder: MouseEventCallBackProperties) {
        if (this.drawnCircles.length > 0) {
            this.drawnCircles.forEach((circle) => circle.remove());
            this.drawnCircles = [];
            return;
        }

        let color = "#a91f03";
        let radius = 9;
        let map: Map<number, Atom | Bond> = bondsMap;
        if (this.name.endsWith("Atoms")) {
            color = "#00a9f3";
            radius = 12;
            map = atomsMap;
        }

        this.tree.all().forEach((node) => {
            const { x, y } = node.point;
            const circle = LayersUtils.getLayer(LayersNames.General).circle(radius).fill(color).cx(x).cy(y);
            this.drawnCircles.push(circle);
        });

        map.forEach((node) => {
            const { x, y } = node.getCenter();
            const circle = LayersUtils.getLayer(LayersNames.General)
                .circle(radius * 0.3)
                .fill("#ffffff")
                // .opacity(0.3)
                .cx(x)
                .cy(y);
            this.drawnCircles.push(circle);
        });
    }
}

const DrawAtoms = new DrawTree("drawAtoms", atomsTree, ["A"]);
const DrawBonds = new DrawTree("drawBonds", bondsTree, ["A"]);

export { DrawAtoms, DrawBonds };
