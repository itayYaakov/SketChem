import { BondConstants } from "@constants/bond.constants";
import { BondOrder, BondStereoKekule, EntityType, LayersNames } from "@constants/enum.constants";
import { EntitiesMapsStorage, NamedPoint } from "@features/shared/storage";
import { IdUtils } from "@src/utils/IdUtils";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Circle, Line, Rect, SVG, Svg } from "@svgdotjs/svg.js";
import { BondAttributes, IBond } from "@types";
import * as VectorUtils from "@utils/vector";

// !!! MOVE TO REDUX??
import { Atom } from "./Atom";

export class Bond {
    static instancesCounter = 1;

    // just a demo for now
    static DefaultAttributes: Partial<BondAttributes> = {
        order: BondOrder.Single,
        stereo: BondStereoKekule.NONE,
    };

    attributes: BondAttributes;

    elem: Rect | undefined;

    startAtom: Atom;

    endAtom: Atom;

    center!: Vector2;

    centralMarks: Circle[] = [
        LayersUtils.getLayer(LayersNames.General).circle(0).hide(),
        LayersUtils.getLayer(LayersNames.General).circle(0).hide(),
        LayersUtils.getLayer(LayersNames.General).circle(0).hide(),
    ];

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

        this.attributes = { ...Bond.DefaultAttributes, id, order: type, stereo, atomStartId, atomEndId };
        const { atomsMap } = EntitiesMapsStorage;
        this.startAtom = EntitiesMapsStorage.getMapInstanceById(atomsMap, this.attributes.atomStartId);
        this.endAtom = EntitiesMapsStorage.getMapInstanceById(atomsMap, this.attributes.atomEndId);

        this.setBondCenter();

        this.addInstanceToMap();
    }

    setBondCenter() {
        if (!this.startAtom || !this.endAtom) {
            this.center = Vector2.zero();
            return;
        }
        const center = this.startAtom.getCenter().add(this.endAtom.getCenter());
        this.center = center.scale(0.5);
        // this.center.x -= BondConstants.padding / 2;
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
        const entry = { id: this.attributes.id, point: this.center, entityType: EntityType.Bond } as NamedPoint;
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
        const startPosition = this.startAtom.getCenter();
        const endPosition = this.endAtom.getCenter();

        const angle = VectorUtils.radToDeg(endPosition.angle(startPosition));
        // if (angle === 0 || angle === 90) return;
        const distance = startPosition.distance(endPosition);

        const rect = LayersUtils.getLayer(LayersNames.Bond).rect(BondConstants.padding, distance);
        if (this.attributes.stereo === BondStereoKekule.NONE) {
            rect.fill(IdUtils.getUrlId(IdUtils.getDefElemId(BondOrder[this.attributes.order])));
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

        this.setBondCenter();

        this.centralMarks[1]
            .show()
            .radius(BondConstants.SelectDistance)
            .cx(this.center.x)
            .cy(this.center.y)
            .fill("#ff0000");

        // this.centralMarks[0]
        //     .show()
        //     .radius(4)
        //     .move(this.startAtom.getCenter().x, this.startAtom.getCenter().y)
        //     .fill("#00ff00");

        // this.centralMarks[2]
        //     .show()
        //     .radius(4)
        //     .cx(this.endAtom.getCenter().x)
        //     .cy(this.endAtom.getCenter().y)
        //     .fill("#0000ff");

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

    getConnectedAtoms() {
        const connectedAtoms = new Set<Atom>();
        connectedAtoms.add(this.startAtom);
        connectedAtoms.add(this.endAtom);
        return connectedAtoms;
    }

    getConnectedAtomsIds() {
        const connectedAtoms = new Set<number>();
        connectedAtoms.add(this.startAtom.getId());
        connectedAtoms.add(this.endAtom.getId());
        return connectedAtoms;
    }

    private moveBondOnCanvas(movedAtomId?: number) {
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

        const startPosition = this.startAtom.getCenter();
        const endPosition = this.endAtom.getCenter();

        rect.move(this.startAtom.getCenter().x, this.startAtom.getCenter().y);
        // !!! I need this for reverse?
        // if (movedAtomId) {
        //     if (movedAtomId === this.startAtom.attributes.id) {
        //         rect.move(this.startAtom.attributes.center.x, this.startAtom.attributes.center.y);
        //     }
        //     // if (movedAtomId === endAtom.attributes.id && movedAtomId > 1) {
        //     //     rect.move(endAtom.attributes.center.x, endAtom.attributes.center.y);
        //     // }
        // }

        const angle = VectorUtils.radToDeg(endPosition.angle(startPosition));
        // if (angle === 0 || angle === 90) return;
        const distance = startPosition.distance(endPosition);

        rect.height(distance);
        rect.transform({
            translate: [-BondConstants.padding / 2, 0],
            origin: "top center",
            rotate: angle - 90,
        });
        this.setBondCenter();

        this.centralMarks[1].cx(this.center.x).cy(this.center.y);

        this.centralMarks[0].move(this.startAtom.getCenter().x, this.startAtom.getCenter().y);

        this.centralMarks[2].cx(this.endAtom.getCenter().x).cy(this.endAtom.getCenter().y);
    }

    movedByAtomId(movedAtomId?: number) {
        this.modifyTree(false);
        this.moveBondOnCanvas(movedAtomId);
        this.modifyTree(true);
    }

    moveTo(newPosition: Vector2, shouldNotify: boolean = true) {
        const delta = newPosition.sub(this.center);
        this.moveByDelta(delta, shouldNotify);
    }

    moveByDelta(delta: Vector2, shouldNotify: boolean = true) {
        if (shouldNotify) {
            this.startAtom.moveByDelta(delta, [this.attributes.id]);
            this.endAtom.moveByDelta(delta, [this.attributes.id]);
        }

        // this.modifyTree(false);
        // this.modifyTree(true);
        this.movedByAtomId();
        // this.attributes.center = newPosition;
    }
    // moveTo(newPosition: Vector2, ignoreNotifyAtomsId: number[] = []) {
    //     const delta = newPosition.sub(this.center);
    //     this.moveByDelta(delta, ignoreNotifyAtomsId);
    // }

    // moveByDelta(delta: Vector2, ignoreNotifyAtomsId: number[] = []) {
    //     if (!ignoreNotifyAtomsId.includes(this.startAtom.getId())) {
    //         this.startAtom.moveByDelta(delta, [this.attributes.id]);
    //     }
    //     if (!ignoreNotifyAtomsId.includes(this.endAtom.getId())) {
    //         this.endAtom.moveByDelta(delta, [this.attributes.id]);
    //     }

    //     // this.modifyTree(false);
    //     // this.modifyTree(true);
    //     this.movedByAtomId();
    //     // this.attributes.center = newPosition;
    // }

    getCenter() {
        return this.center;
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
