/* eslint-disable no-underscore-dangle */
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
import { Entity } from "./Entity";

export class Bond extends Entity {
    static instancesCounter = 1;

    // just a demo for now
    static DefaultAttributes: BondAttributes = {
        id: -1,
        order: BondOrder.Single,
        stereo: BondStereoKekule.NONE,
        atomStartId: -1,
        atomEndId: -1,
    };

    hoverOrSelectShape: Rect | undefined;

    attributes: BondAttributes;

    private elem: Rect | undefined;

    private _startAtom: Atom | undefined;

    public get startAtom(): Atom | undefined {
        return this._startAtom;
    }

    private set startAtom(value: Atom | undefined) {
        this._startAtom = value;
    }

    private _endAtom: Atom | undefined;

    public get endAtom(): Atom | undefined {
        return this._endAtom;
    }

    private set endAtom(value: Atom | undefined) {
        this._endAtom = value;
    }

    private center!: Vector2;

    private connectorObj: any;

    private lastTreeNode: NamedPoint | undefined;

    myType: EntityType = EntityType.Bond;

    constructor(args: IBond) {
        super(args);
        let order: BondOrder;
        let stereo: BondStereoKekule;
        let atomStartId: number;
        let atomEndId: number;
        let id: number;

        if (args.props) {
            const { props } = args;
            id = props.id ?? Bond.generateNewId();
            if (!props.atomStartId || !props.atomEndId) {
                throw new Error("Bond must have start and end atoms!");
            }
            this.attributes = { ...Bond.DefaultAttributes, ...props, id };
        } else if (args.connectorObj) {
            this.connectorObj = args.connectorObj;
            id = KekuleUtils.getNumericId(this.connectorObj.id);
            stereo = this.connectorObj.stereo;
            order = this.connectorObj.getBondOrder ? this.connectorObj.getBondOrder() : 0;
            atomStartId = KekuleUtils.getNumericId(this.connectorObj.getConnectedObjs()[0].id);
            atomEndId = KekuleUtils.getNumericId(this.connectorObj.getConnectedObjs()[1].id);

            this.attributes = { ...Atom.DefaultAttributes, stereo, order, atomStartId, atomEndId, id };
        } else {
            throw new Error(`Bond constructor not implement args = ${args}`);
        }

        this.connectorObj = this.connectorObj ?? KekuleUtils.registerBondFromAttributes(this.attributes);

        this.updateAtomsReference(this.attributes);
        this.setBondCenter();
        this.addInstanceToMap();
        this.setHoverOrSelectShape();
        this.lifeStage = EntityLifeStage.Initialized;

        // // !!! should only draw the valence actually
        this.startAtom?.getOuterDrawCommand();
        this.endAtom?.getOuterDrawCommand();
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

    protected modifyTree(add: boolean = true) {
        if (add) {
            this.lastTreeNode = {
                id: this.attributes.id,
                point: this.center,
                entityType: this.myType,
            };
            EntitiesMapsStorage.bondsTree.insert(this.lastTreeNode);
        } else {
            if (!this.lastTreeNode) return;
            EntitiesMapsStorage.bondsTree.remove(this.lastTreeNode);
        }
    }

    protected addInstanceToMap() {
        const map = EntitiesMapsStorage.bondsMap;
        if (map.has(this.attributes.id)) {
            throw new Error(`Bond object already exists! ${this.attributes.id}`);
        }
        map.set(this.attributes.id, this);
        this.modifyTree(true);
    }

    protected removeInstanceFromMapAndTree() {
        const map = EntitiesMapsStorage.bondsMap;
        if (map.has(this.attributes.id)) map.delete(this.attributes.id);
        this.modifyTree(false);
    }

    move() {
        if (!this.startAtom || !this.endAtom) return;

        this.modifyTree(false);

        const startPosition = this.startAtom.getCenter();
        const endPosition = this.endAtom.getCenter();

        const angle = AngleUtils.radToDeg(endPosition.angle(startPosition));
        const distance = startPosition.distance(endPosition);

        this.elem =
            this.elem ??
            LayersUtils.getLayer(LayersNames.Bond)
                .rect(0, 0)
                .attr({ "pointer-events": "none" })
                .id(IdUtils.getBondElemId(this.attributes.id));

        this.elem.width(BondConstants.padding).height(distance);

        this.elem.move(startPosition.x, startPosition.y);

        this.elem.transform({
            translate: [-BondConstants.padding / 2, 0],
            origin: "top center",
            rotate: angle - 90,
        });

        this.hoverOrSelectShape
            ?.width(BondConstants.padding)
            .height(distance * 0.7)
            .center(this.elem.cx(), this.elem.cy())
            .transform(this.elem.transform());

        this.setBondCenter();

        this.modifyTree(true);
    }

    protected setHoverOrSelectShape() {
        this.hoverOrSelectShape =
            this.hoverOrSelectShape ??
            LayersUtils.getLayer(LayersNames.BondHover)
                .rect()
                .fill({ opacity: 0 })
                .attr({ "pointer-events": "bounding-box" })
                .radius(10)
                .id(`bond_${IdUtils.getAtomElemId(this.getId())}_hover`);

        // this..show().fill("#0fa0fa");
    }

    protected undraw() {
        this.elem?.remove();
        this.hoverOrSelectShape?.remove();
        this.elem = undefined;
        this.hoverOrSelectShape = undefined;
    }

    drawStereoAndOrder() {
        if (!this.elem) {
            throw new Error("Rect is not defined");
        }

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

    draw() {
        this.move();
        this.drawStereoAndOrder();
    }

    getOuterDrawCommand() {
        if (this.lifeStage !== EntityLifeStage.Initialized) return;
        this.draw();
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
        if (this.startAtom && ignoreAtomRemove.includes(this.startAtom.getId())) {
            this.startAtom = undefined;
        }
        if (this.endAtom && ignoreAtomRemove.includes(this.endAtom.getId())) {
            this.endAtom = undefined;
        }

        [this.startAtom, this.endAtom].forEach((atom) => {
            if (!atom) return;

            const atomNeighbors = atom?.getConnectedBondsIds();
            atomNeighbors?.delete(this.attributes.id);

            // delete connected atom only if he will stay orphan
            if (atomNeighbors?.size === 0) {
                atom?.destroy([this.attributes.id]);
            }
        });
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

        this.move();
    }

    getCenter() {
        return this.center;
    }

    updateAttributes(newAttributes: Partial<BondAttributes>) {
        this.attributes = { ...this.attributes, ...newAttributes };

        const moved = newAttributes.atomEndId !== undefined || newAttributes.atomStartId !== undefined;
        const redraw = newAttributes.order !== undefined || newAttributes.stereo !== undefined;

        // !!! not really moved - just changed atom end id or start id
        if (moved) {
            this.updateAtomsReference(newAttributes);
            // console.debug(`Kekule destroy bond ${this.attributes.id}`);
            KekuleUtils.destroy(this.connectorObj);
            this.connectorObj = null;
            this.connectorObj = KekuleUtils.registerBondFromAttributes(this.attributes);
            this.draw();
        }
        if (redraw) {
            this.drawStereoAndOrder();
            // !!! should only draw the valence actually
            this.startAtom?.getOuterDrawCommand();
            this.endAtom?.getOuterDrawCommand();
        }

        const historyItem: ActionItem = {
            command: "CHANGE",
            type: this.myType,
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
            type: this.myType,
            atomAttributes: undefined,
            bondAttributes: this.attributes,
        };

        // bonds need to redraw after connecting bond was removed
        this.startAtom?.getOuterDrawCommand();
        this.endAtom?.getOuterDrawCommand();
        this.startAtom = undefined;
        this.endAtom = undefined;

        // addHistoryItem(historyItem);
    }

    getAttributes() {
        return { ...this.attributes };
    }

    static generateNewId() {
        const lastId = Bond.instancesCounter;
        Bond.instancesCounter += 1;
        return lastId;
    }
}
