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
const DrawMeWedge = {
    name: "Draw Wedge",
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
                    patternTransform: "rotate(90 0 0)",
                    "stroke-linecap": "round",
                }).update((add) => {
                    add.line(0.17, -0.1, 0.17, 1.1).stroke({ color: "#000000", width: 0.17 });
                    add.line(0.51, -0.1, 0.51, 1.1).stroke({ color: "#000000", width: 0.17 });
                    add.line(0.85, -0.1, 0.85, 1.1).stroke({ color: "#000000", width: 0.17 });
                })
            );

            const poly = canvas.defs().polygon("0,1 1,1 0.6,0 0.4,0");

            const clip = canvas.defs().clip().add(poly).attr({
                width: "100%",
                height: "100%",
                clipPathUnits: "objectBoundingBox",
            });

            rect.fill(pattern);
            rect.clipWith(clip);

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

export default DrawMeWedge;
