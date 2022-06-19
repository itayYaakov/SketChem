/* eslint-disable no-underscore-dangle */
import { BondConstants } from "@constants/bond.constants";
import { EditorConstants } from "@constants/editor.constant";
import { BondOrder, BondStereoKekule, EntityLifeStage, EntityType, LayersNames } from "@constants/enum.constants";
import { actions } from "@features/chemistry/chemistrySlice";
// import { addHistoryItem } from "@features/editor/Editor";
import { EntitiesMapsStorage, NamedPoint } from "@features/shared/storage";
import { IdUtils } from "@src/utils/IdUtils";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Circle, Gradient, Line, Path, PathArray, Rect, SVG, Svg } from "@svgdotjs/svg.js";
import { BondAttributes, IBond, IBondCache } from "@types";
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

    private elem: Path | undefined;

    private gradient: Gradient | undefined;

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

    private cache: IBondCache = {
        startPosition: Vector2.zero(),
        endPosition: Vector2.zero(),
        color1: "#000000",
        color2: "#000000",
        angleRad: 0,
        angleDeg: 0,
        distance: 0,
    };

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

            this.attributes = { ...Bond.DefaultAttributes, stereo, order, atomStartId, atomEndId, id };
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
    }

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

    stCircle: Circle[] = [];

    private move() {
        if (!this.startAtom || !this.endAtom) return;

        this.modifyTree(false);

        const startCenter = this.startAtom.getCenter();
        const endCenter = this.endAtom.getCenter();

        const angle1Rad = startCenter.angle(endCenter);
        const angle1Deg = AngleUtils.radToDeg(angle1Rad);
        const distanceCenters = startCenter.distance(endCenter);

        const startPositionBase = this.startAtom.calculateEllipsePointOnCircumferenceGivenAngle(angle1Rad + Math.PI);
        const endPositionBase = this.endAtom.calculateEllipsePointOnCircumferenceGivenAngle(angle1Rad);

        const startPositionHover = startPositionBase;
        const endPositionHover = endPositionBase;

        const distanceForHoverShape = startPositionHover.distance(endPositionHover);

        let delta = endPositionBase.subNew(startPositionBase);

        if (distanceCenters > 0.9 * EditorConstants.Scale) {
            delta = delta.scaleNew(EditorConstants.Scale / distanceCenters);
        }
        const deltaX = 0.1 * delta.x;
        const deltaY = 0.1 * delta.y;

        this.cache.startPosition = startPositionBase.addValues(deltaX, deltaY);
        this.cache.endPosition = endPositionBase.addValues(-deltaX, -deltaY);

        this.cache.angleRad = this.cache.startPosition.angle(this.cache.endPosition) + Math.PI / 2;
        this.cache.angleDeg = AngleUtils.radToDeg(this.cache.angleRad);

        this.cache.distance = this.cache.startPosition.distance(this.cache.endPosition);

        const rectangleTopLeft = {
            x: this.cache.startPosition.x,
            y: this.cache.startPosition.y,
        };

        const hoverTopLeft = {
            x: startPositionHover.x - (BondConstants.padding / 2) * Math.cos(this.cache.angleRad),
            y: startPositionHover.y - (BondConstants.padding / 2) * Math.sin(this.cache.angleRad),
        };

        this.hoverOrSelectShape
            ?.width(BondConstants.padding)
            .height(distanceForHoverShape)
            .x(hoverTopLeft.x)
            .y(hoverTopLeft.y)
            .attr(this.createTransformObject(this.cache.angleDeg, hoverTopLeft));

        this.center = Vector2.midpoint(this.cache.startPosition, this.cache.endPosition, 0.5);

        this.modifyTree(true);
    }

    private createTransformObject(angle2Deg: number, anchor: { x: number; y: number }) {
        return {
            transform: `rotate(${angle2Deg}, ${anchor.x}, ${anchor.y})`,
        };
    }

    protected setHoverOrSelectShape() {
        this.hoverOrSelectShape =
            this.hoverOrSelectShape ??
            LayersUtils.getLayer(LayersNames.BondHover)
                .rect()
                .fill({ opacity: 0 })
                .attr({ "pointer-events": "bounding-box" })
                .radius(10)
                .id(`${IdUtils.getBondElemId(this.getId())}_hover`);

        // this..show().fill("#0fa0fa");
    }

    protected undraw() {
        this.elem?.remove();
        this.gradient?.remove();
        this.hoverOrSelectShape?.remove();
        this.elem = undefined;
        this.gradient = undefined;
        this.hoverOrSelectShape = undefined;
    }

    drawStereoAndOrder() {
        // const pathArray = BondConstants.createBondWedgeBackPointsArray(this.center, this.center);

        this.elem =
            this.elem ??
            LayersUtils.getLayer(LayersNames.Bond)
                .path()
                .fill("none")
                .attr({ "pointer-events": "none" })
                .id(IdUtils.getBondElemId(this.attributes.id))
                .stroke({
                    color: "black",
                    width: BondConstants.wedgeStroke,
                    linecap: "round",
                    linejoin: "round",
                });

        const singleBond = this.attributes.order === BondOrder.Single;
        const doubleBond = this.attributes.order === BondOrder.Double;
        const tripleBond = this.attributes.order === BondOrder.Triple;
        const stereoNone = this.attributes.stereo === BondStereoKekule.NONE;
        const wedgeBack = this.attributes.stereo === BondStereoKekule.DOWN;
        const wedgeFront = this.attributes.stereo === BondStereoKekule.UP;

        let pathArray: PathArray | undefined;

        if (wedgeBack && singleBond) {
            pathArray = BondConstants.createBondWedgeBackPointsArray(this.cache);
        } else if (wedgeFront && singleBond) {
            pathArray = BondConstants.createBondWedgeFrontPointsArray(this.cache);
        } else if (stereoNone && singleBond) {
            pathArray = BondConstants.createRegularBondPointsArray(this.cache, 1);
        } else if (stereoNone && doubleBond) {
            pathArray = BondConstants.createRegularBondPointsArray(this.cache, 2);
        } else if (stereoNone && tripleBond) {
            pathArray = BondConstants.createRegularBondPointsArray(this.cache, 3);
        }

        if (pathArray) this.elem.plot(pathArray);
        let rotate = true;
        let drawGradient = true;
        if (wedgeBack && singleBond) {
            this.elem?.attr(this.createTransformObject(this.cache.angleDeg + 90, this.cache.startPosition));
            rotate = false;
        }
        if (wedgeFront && singleBond) {
            this.elem?.fill("black");
            drawGradient = false;
        }

        if (drawGradient) {
            this.createOrUpdateGradient(rotate);
            this.elem?.stroke(this.gradient!.url());
        }
    }

    createOrUpdateGradient(rotate: boolean) {
        const color1 = this.startAtom?.getColor() ?? "#000000";
        const color2 = this.endAtom?.getColor() ?? "#000000";
        this.gradient =
            this.gradient ??
            LayersUtils.getLayer(LayersNames.Root)
                .gradient("linear", (add) => {
                    add.stop(0, color1);
                    add.stop(1, color2);
                })
                // .attr({ gradientUnits: "userSpaceOnUse" })
                .id(`${IdUtils.getBondElemId(this.attributes.id)}_gradient`);

        if (color1 !== this.cache.color1 || color2 !== this.cache.color2) {
            this.cache.color1 = color1;
            this.cache.color2 = color2;
            this.gradient.update((add) => {
                add.stop(0, color1);
                add.stop(1, color2);
            });
        }

        if (rotate) {
            this.gradient.attr({
                gradientTransform: `rotate(${this.cache.angleDeg + 90} 0.5 0)`,
                // gradientTransform: `rotate(${this.cache.angleDeg + 90} 0.5 0)`,
            });
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

        this.draw();
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
