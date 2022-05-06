import { BondConstants } from "@constants/bond.constants";
import { BondType } from "@constants/enum.constants";
import { Atom, Bond } from "@entities";
import type { Line, Rect } from "@svgdotjs/svg.js";
import { Pattern, SVG } from "@svgdotjs/svg.js";
import { BondAttributes, BondEditorContext } from "@types";
import * as VectorUtils from "@utils/vector";

function BondMove(props: BondEditorContext) {
    const rect: Rect | null = SVG(`#${BondConstants.getElemId(props.bondAttrs.id)}`) as Rect;
    if (!rect) {
        console.error(
            "rect is undefined!",
            `#${BondConstants.getElemId(props.bondAttrs.id)}`,
            rect,
            props.bondAttrs.id
        );
        return;
    }
    // if (!props.elem) {
    //     console.error("elem is undefined!", props, props.elem);
    //     return;
    // }
    if (rect == null) return;
    // const { bond } = props.bondId;
    const connectedAtoms = Bond.getConnectedAtoms(props.bondAttrs);
    if (!connectedAtoms) return;
    const { startAtom, endAtom } = connectedAtoms;
    const startPosition = startAtom.attributes.center;
    const endPosition = endAtom.attributes.center;

    if (props.movedAtomId && props.movedAtomId === startAtom.attributes.id) {
        rect.move(startAtom.attributes.center.x, startAtom.attributes.center.y);
    }
    // const angleCalc = (x1: number, y1: number, x2: number, y2: number) =>
    //     Math.atan2(x1 * y2 - y1 * x2, x1 * x2 + y1 * y2);

    // const angle = VectorUtils.radToDeg(startPosition.angle(endPosition));
    const angle = VectorUtils.radToDeg(endPosition.angle(startPosition));
    // const angle = VectorUtils.radToDeg(angleCalc(startPosition.x, startPosition.y, endPosition.x, endPosition.y));
    console.log("angle=", angle);
    // if (angle === 0 || angle === 90) return;
    const distance = startPosition.distance(endPosition);

    rect.height(distance);
    rect.transform({
        // translate: [-BondConstants.padding / 2, 0],
        origin: "top center",
        rotate: angle - 90,
    });
}

export default BondMove;
