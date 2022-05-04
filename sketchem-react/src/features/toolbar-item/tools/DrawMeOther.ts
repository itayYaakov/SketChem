import type { Polyline } from "@svgdotjs/svg.js";
import { MouseEventCallBackProperties } from "@types";
import { Vector } from "two.js/src/vector";

import ToolbarItem from "../ToolbarItem";

let line: Polyline;
let points: any;

const DrawMeOther = {
    name: "Free Hand Draw",
    onMouseDown: (eventHolder: MouseEventCallBackProperties) => {
        const { canvas, mouseDownLocation, mouseCurrentLocation } = eventHolder;
        points = [];
        const { x, y } = mouseDownLocation;
        points.push([x, y]);
        // Create polygon and create Runner with Controller
        line = canvas.polyline(points);
        line.stroke({ width: 5, color: "#bb8812" }).fill("none");
    },
    onMouseMove: (eventHolder: MouseEventCallBackProperties) => {
        const { canvas, mouseDownLocation, mouseCurrentLocation } = eventHolder;
        const { x, y } = mouseCurrentLocation;
        points.push([x, y]);
        line.plot(points);
    },
    onMouseUp: (eventHolder: MouseEventCallBackProperties) => {},
    keyboardKeys: ["A"],
} as ToolbarItem;

export default DrawMeOther;
