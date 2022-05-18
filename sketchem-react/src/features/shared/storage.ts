import Vector2 from "@src/utils/mathsTs/Vector2";
import { Svg } from "@svgdotjs/svg.js";
import RBush from "rbush";

interface NamedPoint {
    id: number;
    point: Vector2;
}
class PointRBush extends RBush<NamedPoint> {
    toBBox(v: NamedPoint) {
        return { minX: v.point.x, minY: v.point.y, maxX: v.point.x, maxY: v.point.y };
    }

    compareMinX(a: NamedPoint, b: NamedPoint) {
        return a.point.x - b.point.x;
    }

    compareMinY(a: NamedPoint, b: NamedPoint) {
        return a.point.y - b.point.y;
    }

    equals(a: NamedPoint, b: NamedPoint) {
        return a.id === b.id;
    }

    remove(item: NamedPoint) {
        return super.remove(item, this.equals);
    }
}

// maximum number of entries in a tree node. 9 (used by default) is a reasonable
// choice for most applications.Higher value means faster insertion and slower search,
// and vice versa
const ENTRIES_AMOUNT = 7;
const atomsTree = new PointRBush(ENTRIES_AMOUNT);
const bondsTree = new PointRBush(ENTRIES_AMOUNT);

export const itemsMaps = {
    atoms: atomsTree,
    bonds: bondsTree,
};
