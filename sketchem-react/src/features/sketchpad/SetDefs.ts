import { BondConstants } from "@constants/bond.constants";
import { BondType } from "@constants/enum.constants";
import { Pattern, Svg } from "@svgdotjs/svg.js";

function getElementId(name: String) {
    return `def_${name}`;
}

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
            .id(getElementId(BondType[BondType.Single]))
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
            .id(getElementId(BondType[BondType.Double]))
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
            .id(getElementId(BondType[BondType.Triple]))
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
            .id(getElementId(BondType[BondType.WedgeFront]))
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
            .id(getElementId(BondType[BondType.WedgeBack]))
    );

    const poly = canvas.defs().polygon("0,1 1,1 0.52,0 0.48,0");
    // const poly = canvas.defs().polygon("0,1 1,1 0.5,0");

    const clip = canvas
        .defs()
        .clip()
        .add(poly)
        .attr({
            width: "100%",
            height: "100%",
            clipPathUnits: "objectBoundingBox",
        })
        .id(getElementId(BondConstants.poly_clip_id));
}
