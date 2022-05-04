import { BondType } from "@constants/enum.constants";
import type { Line } from "@svgdotjs/svg.js";
import { MouseEventCallBackProperties } from "@types";
import { Vector } from "two.js/src/vector";

import ToolbarItem from "../ToolbarItem";

let line: Line | null;

const DrawMe1 = {
    name: "Draw 1",
    onMouseDown: (eventHolder: MouseEventCallBackProperties) => {
        line = null;
    },
    onMouseMove: (eventHolder: MouseEventCallBackProperties) => {
        const { canvas, mouseDownLocation, mouseCurrentLocation } = eventHolder;
        const { x, y } = mouseCurrentLocation;

        // const rect = canvas.defs().rect(100, 100).fill(`#${BondType[BondType.SINGLE]}`);
        // const use = draw.use(rect).move(200, 200);

        if (line == null) {
            line = canvas.defs().line(mouseDownLocation.x, mouseDownLocation.y, x, y);

            // const pattern = canvas.defs().pattern();
            // const line1 = canvas.use(line).move(0, -15);
            // const line2 = canvas.use(line).move(0, 0);
            // const line3 = canvas.use(line).move(0, 15);
            line.fill("url(#one_lines)");
        } else {
            line.plot(mouseDownLocation.x, mouseDownLocation.y, x, y);
        }
    },
    onMouseUp: (eventHolder: MouseEventCallBackProperties) => {},
    keyboardKeys: ["A"],
} as ToolbarItem;

export default DrawMe1;
