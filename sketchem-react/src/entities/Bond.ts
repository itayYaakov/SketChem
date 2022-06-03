import { BondConstants } from "@constants/bond.constants";
import { BondOrder, BondStereoKekule, EntityLifeStage, EntityType, LayersNames } from "@constants/enum.constants";
import { actions } from "@features/chemistry/chemistrySlice";
// import { addHistoryItem } from "@features/editor/Editor";
import { EntitiesMapsStorage, NamedPoint } from "@features/shared/storage";
import { IdUtils } from "@src/utils/IdUtils";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Circle, Line, Rect, SVG, Svg } from "@svgdotjs/svg.js";
import { ActionItem, BondAttributes, IBond } from "@types";
import { AngleUtils } from "@utils/AngleUtils";

// !!! MOVE TO REDUX??
import { Atom } from "./Atom";

export class Bond {
    static instancesCounter = 1;

    // just a demo for now
    static DefaultAttributes: Partial<BondAttributes> = {
        order: BondOrder.Single,
        stereo: BondStereoKekule.NONE,
    };

    private attributes: BondAttributes;

    private elem: Rect | undefined;

    startAtom: Atom | undefined;

    endAtom: Atom | undefined;

    private center!: Vector2;

    private lifeStage: EntityLifeStage;

    centralMarks: Circle[] = [
        LayersUtils.getLayer(LayersNames.General).circle(0).hide(),
        LayersUtils.getLayer(LayersNames.General).circle(0).hide(),
        LayersUtils.getLayer(LayersNames.General).circle(0).hide(),
    ];

    connectorObj: any;

    private lastTreeNode: NamedPoint | undefined;

    constructor(args: IBond) {
        this.lifeStage = EntityLifeStage.New;
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
        this.connectorObj = this.connectorObj ?? KekuleUtils.registerBondFromAttributes(this.attributes);

        this.updateAtomsReference(this.attributes);
        this.setBondCenter();
        this.addInstanceToMap();
        this.lifeStage = EntityLifeStage.Initialized;

        const historyItem: ActionItem = {
            command: "ADD",
            type: "BOND",
            atomAttributes: undefined,
            bondAttributes: this.attributes,
        };

        // addHistoryItem(historyItem);
    }

    updateAtomsReference(attributes?: Partial<BondAttributes>) {
        if (!attributes) return;

        const { getAtomById } = EntitiesMapsStorage;
        if (this.attributes.atomStartId) this.startAtom = getAtomById(this.attributes.atomStartId);
        if (this.attributes.atomEndId) this.endAtom = getAtomById(this.attributes.atomEndId);
    }

    setBondCenter() {
        if (!this.startAtom || !this.endAtom) {
            this.center = Vector2.zero();
            return;
        }
        this.center = this.startAtom.getCenter().addNew(this.endAtom.getCenter()).scaleSelf(0.5);
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

    private modifyTree(add: boolean = true) {
        if (add) {
            this.lastTreeNode = {
                id: this.attributes.id,
                point: this.center,
                entityType: EntityType.Bond,
            };
            EntitiesMapsStorage.bondsTree.insert(this.lastTreeNode);
        } else {
            if (!this.lastTreeNode) return;
            EntitiesMapsStorage.bondsTree.remove(this.lastTreeNode);
        }
    }

    addInstanceToMap() {
        const map = EntitiesMapsStorage.bondsMap;
        if (map.has(this.attributes.id)) {
            throw new Error(`Bond object already exists! ${this.attributes.id}`);
        }
        map.set(this.attributes.id, this);
        this.modifyTree(true);
    }

    private removeInstanceFromMapAndTree() {
        const map = EntitiesMapsStorage.bondsMap;
        if (map.has(this.attributes.id)) map.delete(this.attributes.id);
        this.modifyTree(false);
    }

    getId() {
        return this.attributes.id;
    }

    move() {
        if (!this.startAtom || !this.endAtom) return;

        const startPosition = this.startAtom.getCenter();
        const endPosition = this.endAtom.getCenter();

        const angle = AngleUtils.radToDeg(endPosition.angle(startPosition));
        const distance = startPosition.distance(endPosition);

        this.elem =
            this.elem ??
            LayersUtils.getLayer(LayersNames.Bond).rect(0, 0).id(IdUtils.getBondElemId(this.attributes.id));

        this.elem.width(BondConstants.padding).height(distance);

        this.elem.move(startPosition.x, startPosition.y);

        this.elem.transform({
            translate: [-BondConstants.padding / 2, 0],
            origin: "top center",
            rotate: angle - 90,
        });

        this.setBondCenter();

        // only draw circles

        if (this.centralMarks[1].cx() === 0) {
            this.centralMarks[1].show().radius(BondConstants.SelectDistance).fill("#ff0000").opacity(0.1);
        }
        if (this.centralMarks[0].cx() === 0) {
            this.centralMarks[0]
                // .show()
                .radius(4)
                .move(this.startAtom.getCenter().x, this.startAtom.getCenter().y)
                .fill("#00ff00");
        }
        if (this.centralMarks[2].cx() === 0) {
            this.centralMarks[2]
                // .show()
                .radius(4)
                .move(this.startAtom.getCenter().x, this.startAtom.getCenter().y)
                .fill("#00ff00");
        }

        this.centralMarks[1].cx(this.center.x).cy(this.center.y);

        this.centralMarks[0].cx(startPosition.x).cy(startPosition.y);

        this.centralMarks[2].cx(endPosition.x).cy(endPosition.y);
    }

    private undraw() {
        this.elem?.remove();
        this.centralMarks?.forEach((mark) => mark.remove());
    }

    draw() {
        this.move();
        this.drawStereoAndOrder();
    }

    drawStereoAndOrder() {
        if (!this.elem) throw new Error("Rect is not defined");

        if (this.attributes.stereo === BondStereoKekule.NONE) {
            this.elem.fill(IdUtils.getUrlId(IdUtils.getDefElemId(BondOrder[this.attributes.order])));
        } else {
            this.elem.fill(IdUtils.getUrlId(IdUtils.getDefElemId(BondStereoKekule[this.attributes.stereo])));
        }

        switch (this.attributes.stereo) {
            case BondStereoKekule.DOWN:
            case BondStereoKekule.UP:
                this.elem.attr("clip-path", IdUtils.getUrlId(IdUtils.getDefElemId(BondConstants.poly_clip_id)));
                break;

            default:
                this.elem.attr("clip-path", "");
        }
    }

    select(isSelected: boolean) {
        if (!this.elem) throw new Error("Rect is not defined");

        if (isSelected) {
            this.elem.attr({ filter: IdUtils.getUrlId(IdUtils.getDefElemId(BondConstants.hoverFilter)) });

            if (this.attributes.stereo === BondStereoKekule.UP) {
                this.elem.attr({ "fill-opacity": 0.7 });
            }
        } else {
            this.elem.attr({ filter: "" });
            if (this.attributes.stereo === BondStereoKekule.UP) {
                this.elem.attr({ "fill-opacity": 1 });
            }
        }
    }

    getConnectedAtoms() {
        const connectedAtoms = new Set<Atom>();
        if (this.startAtom) connectedAtoms.add(this.startAtom);
        if (this.endAtom) connectedAtoms.add(this.endAtom);
        return connectedAtoms;
    }

    getConnectedAtomsIds() {
        const connectedAtoms = new Set<number>();
        if (this.startAtom) connectedAtoms.add(this.startAtom.getId());
        if (this.endAtom) connectedAtoms.add(this.endAtom.getId());
        return connectedAtoms;
    }

    removeConnectedAtoms(ignoreAtomRemove: number[] = []) {
        [this.startAtom, this.endAtom].forEach((atom) => {
            if (atom?.getId() && ignoreAtomRemove.indexOf(atom.getId()) !== -1) return;
            const atomNeighbors = atom?.getConnectedBondsIds();
            atomNeighbors?.delete(this.attributes.id);

            // delete connected atom only if he will stay orphan
            if (atomNeighbors?.size === 0) {
                atom?.destroy([this.attributes.id]);
            }
        });
        this.startAtom = undefined;
        this.endAtom = undefined;
    }

    movedByAtomId(movedAtomId?: number) {
        this.modifyTree(false);
        this.move();
        this.modifyTree(true);
    }

    moveTo(newPosition: Vector2, shouldNotify: boolean = true) {
        const delta = newPosition.subNew(this.center);
        this.moveByDelta(delta, shouldNotify);
    }

    moveByDelta(delta: Vector2, shouldNotify: boolean = true) {
        if (shouldNotify) {
            this.startAtom?.moveByDelta(delta, [this.attributes.id]);
            this.endAtom?.moveByDelta(delta, [this.attributes.id]);
        }

        this.movedByAtomId();
    }

    getCenter() {
        return this.center;
    }

    getAttributes() {
        // return a copy of attributes
        return { ...this.attributes };
    }

    updateAttributes(newAttributes: Partial<BondAttributes>) {
        this.attributes = { ...this.attributes, ...newAttributes };

        const moved = newAttributes.atomEndId !== undefined || newAttributes.atomStartId !== undefined;
        const redraw = newAttributes.order !== undefined || newAttributes.stereo !== undefined;

        if (moved) {
            this.updateAtomsReference(newAttributes);
            this.move();
        }
        if (redraw) {
            this.drawStereoAndOrder();
        }

        const historyItem: ActionItem = {
            command: "CHANGE",
            type: "BOND",
            atomAttributes: undefined,
            bondAttributes: this.attributes,
        };

        // addHistoryItem(historyItem);
    }

    destroy(ignoreAtomRemove: number[] = [], IShouldNotifyAtoms: boolean = true) {
        if (this.lifeStage === EntityLifeStage.DestroyInit || this.lifeStage === EntityLifeStage.Destroyed) {
            return;
        }
        this.lifeStage = EntityLifeStage.DestroyInit;
        if (this.connectorObj) {
            this.undraw();
            if (IShouldNotifyAtoms) {
                this.removeConnectedAtoms(ignoreAtomRemove);
            }

            this.removeInstanceFromMapAndTree();
            KekuleUtils.destroy(this.connectorObj);
            this.connectorObj = null;
        }
        this.lifeStage = EntityLifeStage.Destroyed;

        const historyItem: ActionItem = {
            command: "REMOVE",
            type: "BOND",
            atomAttributes: undefined,
            bondAttributes: this.attributes,
        };

        // addHistoryItem(historyItem);
    }

    static generateNewId() {
        const lastId = Bond.instancesCounter;
        Bond.instancesCounter += 1;
        return lastId;
    }
}
