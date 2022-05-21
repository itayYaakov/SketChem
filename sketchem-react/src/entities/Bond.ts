import { BondConstants } from "@constants/bond.constants";
import { BondOrder, BondStereoKekule, LayersNames } from "@constants/enum.constants";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { IdUtils } from "@src/utils/IdUtils";
import { KekuleUtils } from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Line, Rect, SVG, Svg } from "@svgdotjs/svg.js";
import { BondAttributes, IBond } from "@types";
import * as VectorUtils from "@utils/vector";

// !!! MOVE TO REDUX??
import { Atom } from "./Atom";

export class Bond {
    static instancesCounter = 1;

    // just a demo for now
    static DefaultAttributes: Partial<BondAttributes> = {
        type: BondOrder.Single,
        stereo: BondStereoKekule.NONE,
    };

    attributes: BondAttributes;

    elem: Rect | undefined;

    startAtom: Atom;

    endAtom: Atom;

    center!: Vector2;

    connectorObj: any;

    constructor(args: IBond) {
        let type: BondOrder;
        let stereo: BondStereoKekule;
        let atomStartId: number;
        let atomEndId: number;
        let id: number;

        if (args.props) {
            ({ order: type, stereo, atomStartId, atomEndId } = args.props);
            // !!! make sure id is valid - a number, and greater than instance counter
            id = args.props.optionalId ?? Bond.generateNewId();
        } else if (args.connectorObj) {
            this.connectorObj = args.connectorObj;
            id = KekuleUtils.getNumericId(this.connectorObj.id);
            stereo = this.connectorObj.stereo;
            type = this.connectorObj.getBondOrder ? this.connectorObj.getBondOrder() : 0;
            atomStartId = KekuleUtils.getNumericId(this.connectorObj.getConnectedObjs()[0].id);
            atomEndId = KekuleUtils.getNumericId(this.connectorObj.getConnectedObjs()[1].id);
        } else {
            throw new Error(`Bond constructor not implement args = ${args}`);
        }

        this.attributes = { ...Bond.DefaultAttributes, id, type, stereo, atomStartId, atomEndId };
        const { atomsMap } = EntitiesMapsStorage;
        this.startAtom = EntitiesMapsStorage.getMapInstanceById(atomsMap, this.attributes.atomStartId);
        this.endAtom = EntitiesMapsStorage.getMapInstanceById(atomsMap, this.attributes.atomEndId);

        this.setBondCenter();

        this.addInstanceToMap();
    }

    setBondCenter(rect?: any) {
        if (!this.startAtom || !this.endAtom) {
            this.center = Vector2.zero();
            return;
        }
        const center = this.startAtom.attributes.center.add(this.endAtom.attributes.center);
        this.center = center.scale(0.5);
        this.center.x -= BondConstants.padding / 2;
    }

    // setBondCenter(rect?: Rect) {
    //     if (!rect) {
    //         this.center = Vector2.zero();
    //         return;
    //     }
    //     const bbox = rect.bbox();
    //     this.center = new Vector2((bbox.x + bbox.x2) / 2, (bbox.y + bbox.y2) / 2);
    // }

    modifyTree(add: boolean = true) {
        const entry = { id: this.attributes.id, point: this.center };
        if (add) {
            EntitiesMapsStorage.bondsTree.insert(entry);
        } else {
            EntitiesMapsStorage.bondsTree.remove(entry);
        }
    }

    addInstanceToMap() {
        const map = EntitiesMapsStorage.bondsMap;
        if (map.has(this.attributes.id)) {
            console.error("Object already exists!");
        }
        if (map.has(this.attributes.id)) return;
        map.set(this.attributes.id, this);
        this.modifyTree(true);
    }

    removeInstanceFromMap() {
        const map = EntitiesMapsStorage.bondsMap;
        if (!map.has(this.attributes.id)) return;
        map.delete(this.attributes.id);
        this.modifyTree(true);
    }

    getId() {
        return this.attributes.id;
    }

    draw() {
        // !!! MOVE TO REDUX ???
        const result = this.addBondToCanvas();
        if (!result) {
            console.error("result=", result, "in Bond.ts");
        }
    }

    private addBondToCanvas(): Rect | undefined {
        const startPosition = this.startAtom.attributes.center;
        const endPosition = this.endAtom.attributes.center;

        const angle = VectorUtils.radToDeg(endPosition.angle(startPosition));
        // if (angle === 0 || angle === 90) return;
        const distance = startPosition.distance(endPosition);

        const rect = LayersUtils.getLayer(LayersNames.Bond).rect(BondConstants.padding, distance);
        if (this.attributes.stereo === BondStereoKekule.NONE) {
            rect.fill(IdUtils.getUrlId(IdUtils.getDefElemId(BondOrder[this.attributes.type])));
        } else {
            console.log("stereo=", this.attributes.stereo, BondStereoKekule[this.attributes.stereo]);
            rect.fill(IdUtils.getUrlId(IdUtils.getDefElemId(BondStereoKekule[this.attributes.stereo])));
        }

        rect.move(startPosition.x, startPosition.y).id(IdUtils.getBondElemId(this.attributes.id));

        switch (this.attributes.stereo) {
            case BondStereoKekule.DOWN:
            case BondStereoKekule.UP:
                rect.attr("clip-path", IdUtils.getUrlId(IdUtils.getDefElemId(BondConstants.poly_clip_id)));
                break;

            default:
                break;
        }

        rect.height(distance);
        rect.transform({
            translate: [-BondConstants.padding / 2, 0],
            origin: "top center",
            rotate: angle - 90,
        });

        this.setBondCenter(rect);
        LayersUtils.getLayer(LayersNames.General).circle(8).move(this.center.x, this.center.y).fill("#ff0000");
        return rect;
    }

    select(isSelected: boolean) {
        const rect: Rect | null = SVG(`#${IdUtils.getBondElemId(this.attributes.id)}`) as Rect;
        if (isSelected) {
            rect.attr({ filter: IdUtils.getUrlId(IdUtils.getDefElemId(BondConstants.hoverFilter)) });

            if (this.attributes.stereo === BondStereoKekule.UP) {
                rect.attr({ "fill-opacity": 0.7 });
            }
        } else {
            rect.attr({ filter: "" });
            if (this.attributes.stereo === BondStereoKekule.UP) {
                rect.attr({ "fill-opacity": 1 });
            }
        }
    }

    private moveBondOnCanvas(movedAtomId: number | undefined) {
        // !!! remove this svg search
        const rect: Rect | null = SVG(`#${IdUtils.getBondElemId(this.attributes.id)}`) as Rect;
        if (!rect) {
            console.error(
                "rect is undefined!",
                `#${IdUtils.getBondElemId(this.attributes.id)}`,
                rect,
                this.attributes.id
            );
            return;
        }

        if (rect == null) return;

        const startPosition = this.startAtom.attributes.center;
        const endPosition = this.endAtom.attributes.center;

        if (movedAtomId) {
            if (movedAtomId === this.startAtom.attributes.id) {
                rect.move(this.startAtom.attributes.center.x, this.startAtom.attributes.center.y);
            }
            // if (movedAtomId === endAtom.attributes.id && movedAtomId > 1) {
            //     rect.move(endAtom.attributes.center.x, endAtom.attributes.center.y);
            // }
        }

        const angle = VectorUtils.radToDeg(endPosition.angle(startPosition));
        // if (angle === 0 || angle === 90) return;
        const distance = startPosition.distance(endPosition);

        rect.height(distance);
        rect.transform({
            translate: [-BondConstants.padding / 2, 0],
            origin: "top center",
            rotate: angle - 90,
        });
        this.setBondCenter(rect);
    }

    move(movedAtomId: number | undefined) {
        this.modifyTree(false);
        this.moveBondOnCanvas(movedAtomId);
        this.modifyTree(true);
    }

    static getElementStringId(idNum: number) {
        return IdUtils.getBondElemId(idNum);
    }

    static generateNewId() {
        const lastId = Bond.instancesCounter;
        Bond.instancesCounter += 1;
        return lastId;
    }
}
