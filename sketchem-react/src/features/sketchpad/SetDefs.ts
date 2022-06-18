import "@svgdotjs/svg.filter.js";

import { BondConstants } from "@constants/bond.constants";
import { BondOrder, BondStereoKekule } from "@constants/enum.constants";
import { IdUtils } from "@src/utils/IdUtils";
import { Effect, Filter, Pattern, SVG, Svg } from "@svgdotjs/svg.js";

export default function SetDefs(canvas: Svg) {
    canvas.defs().put(
        new Pattern({
            width: "100%",
            height: "100%",
            patternContentUnits: "objectBoundingBox",
        })
            .update((add) => {
                add.line(0.5, 0, 0.5, 1).stroke({ color: "#000000", width: 0.1 });
            })
            .id(IdUtils.getDefElemId(BondOrder[BondOrder.Single]))
    );
    canvas.defs().put(
        new Pattern({
            width: "100%",
            height: "100%",
            patternContentUnits: "objectBoundingBox",
        })
            .update((add) => {
                add.line(0.3, 0, 0.3, 1).stroke({ color: "#000000", width: 0.1 });
                add.line(0.7, 0, 0.7, 1).stroke({ color: "#000000", width: 0.1 });
            })
            .id(IdUtils.getDefElemId(BondOrder[BondOrder.Double]))
    );
    canvas.defs().put(
        new Pattern({
            width: "100%",
            height: "100%",
            patternContentUnits: "objectBoundingBox",
        })
            .update((add) => {
                add.line(0.1, 0, 0.1, 1).stroke({ color: "#000000", width: 0.1 });
                add.line(0.5, 0, 0.5, 1).stroke({ color: "#000000", width: 0.1 });
                add.line(0.9, 0, 0.9, 1).stroke({ color: "#000000", width: 0.1 });
            })
            .id(IdUtils.getDefElemId(BondOrder[BondOrder.Triple]))
    );

    canvas.defs().put(
        new Pattern({
            width: "100%",
            height: "100%",
            patternContentUnits: "objectBoundingBox",
            patternTransform: "rotate(90 0 0)",
            "stroke-linecap": "round",
        })
            .update((add) => {
                add.line(0.17, -0.1, 0.17, 1.1).stroke({ color: "#000000", width: 0.17 });
                add.line(0.51, -0.1, 0.51, 1.1).stroke({ color: "#000000", width: 0.17 });
                add.line(0.85, -0.1, 0.85, 1.1).stroke({ color: "#000000", width: 0.17 });
            })
            .id(IdUtils.getDefElemId(BondStereoKekule[BondStereoKekule.DOWN]))
    );

    canvas.defs().put(
        new Pattern({
            width: "100%",
            height: "100%",
            patternContentUnits: "objectBoundingBox",
            patternTransform: "rotate(90 0 0)",
            "stroke-linecap": "round",
        })
            .update((add) => {
                add.rect(1, 1).fill({ color: "#000000" });
            })
            .id(IdUtils.getDefElemId(BondStereoKekule[BondStereoKekule.UP]))
    );
    // <filter filterUnits="objectBoundingBox" x="0" y="0" width="100%" height="100%">
    //     <feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="#99aa00" flood-opacity="0.9"/>
    //     <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#00aaff" flood-opacity="0.8"/>
    //     <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#00ffff" flood-opacity="0.7"/>
    // </filter>

    const bondFilter = canvas.defs().filter().id(IdUtils.getDefElemId(BondConstants.hoverFilter));
    bondFilter.dropShadow(bondFilter.$sourceAlpha, 0, 0, 5).attr({ "flood-color": "#330033", "flood-opacity": 0.6 });
    bondFilter.dropShadow(bondFilter.$sourceAlpha, 0, 0, 4).attr({ "flood-color": "#880088", "flood-opacity": 0.7 });
    bondFilter.dropShadow(bondFilter.$sourceAlpha, 0, 0, 3).attr({ "flood-color": "#aa00aa", "flood-opacity": 0.8 });
    bondFilter.dropShadow(bondFilter.$sourceAlpha, 0, 0, 2).attr({ "flood-color": "#ff00ff", "flood-opacity": 0.9 });

    // const poly = canvas.defs().polygon("0,1 1,1 0.52,0 0.48,0");
    const poly = canvas.defs().polygon("0.2,1 0.8,1 0.5,0");

    const clip = canvas
        .defs()
        .clip()
        .add(poly)
        .attr({
            width: "100%",
            height: "100%",
            clipPathUnits: "objectBoundingBox",
        })
        .id(IdUtils.getDefElemId(BondConstants.poly_clip_id));
}
