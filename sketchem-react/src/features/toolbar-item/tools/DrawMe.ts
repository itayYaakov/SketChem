import type { Line } from "@svgdotjs/svg.js";
import { MouseEventCallBackProperties } from "@types";
import { Vector } from "two.js/src/vector";

import ToolbarItem from "../ToolbarItem";

let line: Line | null;

const DrawMeOther = {
    name: "Draw Line",
    onMouseDown: (eventHolder: MouseEventCallBackProperties) => {
        line = null;
    },
    onMouseMove: (eventHolder: MouseEventCallBackProperties) => {
        const { canvas, mouseDownLocation, mouseCurrentLocation } = eventHolder;
        const { x, y } = mouseCurrentLocation;
        if (line == null) {
            line = canvas.line(mouseDownLocation.x, mouseDownLocation.y, x, y);
            line.stroke({ width: 5, color: "#00aa12", dasharray: "5,5" });
        } else {
            line.plot(mouseDownLocation.x, mouseDownLocation.y, x, y);
        }
    },
    onMouseUp: (eventHolder: MouseEventCallBackProperties) => {},
    keyboardKeys: ["A"],
} as ToolbarItem;

export default DrawMeOther;
