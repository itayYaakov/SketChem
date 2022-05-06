import { BondConstants } from "@constants/bond.constants";
import { BondType } from "@constants/enum.constants";
import { Atom, Bond } from "@entities";
import type { Line, Rect, Svg } from "@svgdotjs/svg.js";
import { Pattern, SVG } from "@svgdotjs/svg.js";
import { BondAttributes, BondEditorContext } from "@types";
import * as VectorUtils from "@utils/vector";
import { Vector } from "vector2d";

function BondAdd(props: BondEditorContext) {
    // const rect: Rect | null = SVG(`#${props.id}`) as Rect;
    // const { bond } = props.bondId;
    const connectedAtoms = Bond.getConnectedAtoms(props.bondAttrs);
    if (!connectedAtoms) return;
    const { startAtom, endAtom } = connectedAtoms;
    const { canvas } = props;
    const startPosition = startAtom.attributes.center;
    const endPosition = endAtom.attributes.center;

    // const angle = VectorUtils.radToDeg(VectorUtils.get180angle(startPosition, endPosition));
    const angle = VectorUtils.radToDeg(startPosition.angle(endPosition));
    // if (angle === 0 || angle === 90) return;
    const distance = startPosition.distance(endPosition);

    const rect = canvas.rect(BondConstants.padding, distance);
    rect.fill(`url(#def_${BondType[props.bondAttrs.type]})`);
    switch (props.bondAttrs.type) {
        case BondType.WedgeBack:
        case BondType.WedgeFront:
            rect.attr("clip-path", `url(#def_${BondConstants.poly_clip_id})`);
            break;

        default:
            break;
    }
    rect.move(endAtom.attributes.center.x, endAtom.attributes.center.y);
    rect.id(BondConstants.getElemId(props.bondAttrs.id));

    rect.height(distance);
    rect.transform({
        translate: [-BondConstants.padding / 2, 0],
        origin: "top center",
        rotate: angle - 90,
    });
}

export default BondAdd;
