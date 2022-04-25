import { MouseEventCallBackProperties } from "@types";
import Two from "two.js";
import { Anchor } from "two.js/src/anchor";
import { Collection } from "two.js/src/collection";
import { Path } from "two.js/src/path";
import { Rectangle } from "two.js/src/shapes/rectangle";
import { Vector } from "two.js/src/vector";

import ToolbarItem from "../ToolbarItem";

let line: Path | null;

function makeCurve(two: Two, points: Anchor[], close_flag?: boolean): Path {
    const last = close_flag;
    const curve = new Path(points, !(typeof last === "boolean" ? last : undefined), true);
    const rect = curve.getBoundingClientRect();
    curve.center().translation.set(rect.left + rect.width / 2, rect.top + rect.height / 2);

    two.scene.add(curve);

    return curve;
}

const DrawMe = {
    name: "DrawMeOther",
    onMouseDown: (eventHolder: MouseEventCallBackProperties) => {
        line = null;
    },
    onMouseMove: (eventHolder: MouseEventCallBackProperties) => {
        const { two, mouseDownLocation, mouseCurrentLocation } = eventHolder;
        const { x, y } = mouseCurrentLocation;
        if (line == null) {
            const v1 = new Two.Anchor(mouseDownLocation.x, mouseDownLocation.y);
            const v2 = new Two.Anchor(x, y);
            line = makeCurve(two, [v1, v2], true);
            line.noFill().stroke = "#00ffaa";
            line.linewidth = 10;
            line.vertices.forEach((v: Anchor) => {
                v.addSelf(line?.translation);
            });
            line.translation.clear();
        } else {
            const v3 = new Two.Anchor(x, y);
            line.vertices.push(v3);
        }
    },
    onMouseUp: (eventHolder: MouseEventCallBackProperties) => {},
    keyboardKeys: ["A"],
} as ToolbarItem;

export default DrawMe;
