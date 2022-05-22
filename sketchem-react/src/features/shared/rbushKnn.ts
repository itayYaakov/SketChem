import type RBush from "rbush";
import type { BBox } from "rbush";
import Queue from "tinyqueue";

function axisDist(k: number, min: number, max: number) {
    if (k < min) {
        return min - k;
    }
    if (k <= max) {
        return 0;
    }
    return k - max;
}

function boxDist(x: number, y: number, box: BBox) {
    const dx = axisDist(x, box.minX, box.maxX);
    const dy = axisDist(y, box.minY, box.maxY);
    return dx * dx + dy * dy;
}

// children: (3) [{…}, {…}, {…}]
// height: 2
// leaf: false
// maxX: 716.5869432530515
// maxY: 441.7202243483998
// minX: -223.9130567469483
// minY: 53.85318376773341

interface IData {
    children: any;
    height: number;
    leaf: boolean;
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;
}

export interface INode {
    node: any;
    isItem: boolean;
    dist: number;
}

function knn<T>(
    tree: RBush<T>,
    x: number,
    y: number,
    n?: number,
    maxDistance?: number,
    predicate?: (c: any) => boolean
) {
    function compareDist(a: INode, b: INode) {
        return a.dist - b.dist;
    }

    // @ts-ignore
    let node: IData | undefined = tree.data;
    const result: INode[] = [];
    const { toBBox } = tree;
    let i: number;
    let child: any;
    let dist: number;

    const queue = new Queue(undefined, compareDist);

    while (node) {
        for (i = 0; i < node.children.length; i += 1) {
            child = node.children[i];
            dist = boxDist(x, y, node.leaf ? toBBox(child) : child);
            if (!maxDistance || dist <= maxDistance * maxDistance) {
                queue.push({
                    node: child,
                    isItem: node.leaf,
                    dist,
                } as INode);
            }
        }
        while (queue.length && queue.peek()!.isItem) {
            const candidate = queue.pop();
            if (candidate && (!predicate || predicate(candidate.node))) {
                result.push(candidate);
            }
            if (n && result.length === n) {
                return result;
            }
        }

        const queueNode = queue.pop();
        if (queueNode) {
            node = queueNode.node;
        } else {
            node = undefined;
        }
    }

    return result;
}

export default knn;
