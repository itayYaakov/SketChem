import { BondType } from "@constants/enum.constants";
import type { Line, Rect } from "@svgdotjs/svg.js";
import { Pattern } from "@svgdotjs/svg.js";
import { MouseEventCallBackProperties } from "@types";
import { Vector } from "vector2d";

import ToolbarItem from "../ToolbarItem";

function get360angle(Va: Vector, Vb: Vector) {
    const Vc = Vb.clone().subtract(Va);
    const dy = Vc.y;
    const dx = Vc.x;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    // if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}

let rect: Rect | null;
const padding = 10;
const DrawMe3 = {
    name: "Draw 3",
    onMouseDown: (eventHolder: MouseEventCallBackProperties) => {
        rect = null;
    },
    onMouseMove: (eventHolder: MouseEventCallBackProperties) => {
        const { canvas, mouseDownLocation, mouseCurrentLocation } = eventHolder;

        // const rect = canvas.defs().rect(100, 100).fill(`#${BondType[BondType.SINGLE]}`);
        // const use = draw.use(rect).move(200, 200);

        const angle = get360angle(mouseDownLocation, mouseCurrentLocation);
        // if (angle === 0 || angle === 90) return;
        const height = mouseDownLocation.distance(mouseCurrentLocation);

        if (rect == null) {
            rect = canvas.rect(padding, height);
            rect.move(mouseDownLocation.x, mouseDownLocation.y);

            const pattern = canvas.defs().put(
                new Pattern({
                    width: "100%",
                    height: "100%",
                    patternContentUnits: "objectBoundingBox",
                }).update((add) => {
                    add.line(0.1, 0, 0.1, 1).stroke({ color: "#00aa12", width: 0.1 });
                    add.line(0.5, 0, 0.5, 1).stroke({ color: "#00aa12", width: 0.1 });
                    add.line(0.9, 0, 0.9, 1).stroke({ color: "#00aa12", width: 0.1 });
                })
            );

            rect.fill(pattern);

            rect.transform({
                translate: [-padding / 2, 0],
                origin: "top center",
            });
        } else {
            rect.height(height);
            rect.transform({
                translate: [-padding / 2, 0],
                origin: "top center",
                rotate: angle - 90,
            });
        }
    },
    onMouseUp: (eventHolder: MouseEventCallBackProperties) => {},
    keyboardKeys: ["A"],
} as ToolbarItem;

export default DrawMe3;
