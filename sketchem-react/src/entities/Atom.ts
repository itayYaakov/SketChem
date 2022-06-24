import { AtomConstants } from "@constants/atom.constants";
import { EditorConstants } from "@constants/editor.constant";
import { ElementsData, PtElement } from "@constants/elements.constants";
import { EntityLifeStage, EntityType, LayersNames } from "@constants/enum.constants";
import { EntitiesMapsStorage, NamedPoint } from "@features/shared/storage";
import { IdUtils } from "@src/utils/IdUtils";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import * as ValenceUtils from "@src/utils/ValenceUtils";
import styles from "@styles/index.module.scss";
import { Circle, Line, Rect, Text } from "@svgdotjs/svg.js";
import { AtomAttributes, IAtom } from "@types";
import Vector2 from "@utils/mathsTs/Vector2";
import _ from "lodash";

import type { Bond } from "./Bond";
import { Entity } from "./Entity";

export class Atom extends Entity {
    static instancesCounter = 1;

    static DefaultAttributes: AtomAttributes = {
        id: -1,
        charge: 0,
        symbol: "C",
        color: "#ffffff",
        center: Vector2.zero().get(),
    };

    protected center: Vector2 = Vector2.zero();

    protected hoverOrSelectShape: Circle | undefined;

    attributes!: AtomAttributes;

    // private backgroundCircle: Ellipse | undefined;

    private symbolLabel: Text | undefined;

    private valenceErrorLine: Line | undefined;

    private valenceErrorRectangle: Rect | undefined;

    private nodeObj: any;

    private lastTreeNode: NamedPoint | undefined;

    private element: PtElement | undefined;

    private showValenceError: boolean;

    private implicitHydrogenCount: number;

    private backgroundRadiuses: { x: number | undefined; y: number | undefined } = { x: undefined, y: undefined };

    myType: EntityType = EntityType.Atom;

    constructor(args: IAtom) {
        super();
        this.lifeStage = EntityLifeStage.New;
        let id;
        let color;
        this.showValenceError = false;
        if (args.props) {
            const { props } = args;
            // !!! make sure itd is valid - a number, and greater than instance counter
            id = props.id ?? Atom.generateNewId();
            color = props.color;
            this.attributes = { ...Atom.DefaultAttributes, ...props, id };
            this.nodeObj = KekuleUtils.registerAtomFromAttributes(this.attributes);
        } else if (args.nodeObj) {
            this.nodeObj = args.nodeObj;
            id = KekuleUtils.getNumericId(this.nodeObj.id);
            color = undefined;
            const charge = this.nodeObj.getCharge();
            const symbol = this.nodeObj.getLabel();
            const center = this.nodeObj.getCoord2D();
            this.attributes = { ...Atom.DefaultAttributes, charge, symbol, center, id };
        } else {
            throw new Error(`Atom constructor not implement args = ${args}`);
        }

        const elementsMap = ElementsData.elementsBySymbolMap;
        this.element = elementsMap.get(this.attributes.symbol);
        this.attributes.color = this.getElementColor(this.element, color);
        this.center = new Vector2(this.attributes.center.x, this.attributes.center.y);
        this.showValenceError = false;
        this.implicitHydrogenCount = 0;
        this.calculateImplicitHydrogen();

        this.addInstanceToMap();
        this.setHoverOrSelectShape();
        this.lifeStage = EntityLifeStage.Initialized;
    }

    private getElementColor(element: PtElement | undefined, color?: string) {
        return color ?? element?.customColor ?? element?.cpkColor ?? element?.jmolColor ?? "#000000";
        // return color ?? element?.customColor ?? element?.jmolColor ?? element?.cpkColor ?? "#000000";
    }

    protected modifyTree(add: boolean = true) {
        if (add) {
            this.lastTreeNode = {
                id: this.attributes.id,
                point: this.center,
                entityType: this.myType,
            };
            EntitiesMapsStorage.atomsTree.insert(this.lastTreeNode);
        } else {
            if (!this.lastTreeNode) return;
            EntitiesMapsStorage.atomsTree.remove(this.lastTreeNode);

            // for debugging
            /* 
            const treeBefore = EntitiesMapsStorage.atomsTree.all();
            const treeSizeBefore = treeBefore.length;
            console.log("Atoms tree size before remove = ", treeSizeBefore);
            EntitiesMapsStorage.atomsTree.remove(this.lastTreeNode);
            const treeAfter = EntitiesMapsStorage.atomsTree.all();
            const treeSizeAfter = treeAfter.length;
            console.log("Atoms tree size after remove = ", treeSizeAfter);
            if (treeSizeBefore === treeSizeAfter) {
                console.error("Atoms tree remove error!");
                EntitiesMapsStorage.atomsTree.remove(this.lastTreeNode);
                // const treeAfter2 = EntitiesMapsStorage.atomsTree.all();
                // const treeSizeAfter2 = treeAfter2.length;
                // console.log("Atoms tree size after doube remove = ", treeSizeAfter2);
            }
            */
        }
    }

    protected addInstanceToMap() {
        const map = EntitiesMapsStorage.atomsMap;
        if (map.has(this.attributes.id)) {
            console.error("Object already exists!");
        }
        if (map.has(this.attributes.id)) return;
        map.set(this.attributes.id, this);
        this.modifyTree(true);
    }

    protected removeInstanceFromMapAndTree() {
        const map = EntitiesMapsStorage.atomsMap;
        if (map.has(this.attributes.id)) map.delete(this.attributes.id);
        this.modifyTree(false);
    }

    getId() {
        return this.attributes.id;
    }

    moveByDelta(delta: Vector2, ignoreNotifyBondsIds: number[] = []) {
        const newPosition = this.center.addNew(delta);
        this.center = newPosition;
        this.updateAttributes({ center: newPosition.get() }, ignoreNotifyBondsIds);
    }

    getNeighbors() {
        return KekuleUtils.getAtomNeighbors(this.getKekuleNode());
    }

    getNeighborsIds() {
        return KekuleUtils.getAtomNeighborsIds(this.getKekuleNode());
    }

    getConnectedBonds() {
        const connectedBonds = new Set<Bond>();
        const connectedBondsKekule: any[] | [] = KekuleUtils.getLinkedBonds(this.getKekuleNode());

        connectedBondsKekule.forEach((bondKekule: any) => {
            const id = KekuleUtils.getNumericId(bondKekule.id);
            const bond = EntitiesMapsStorage.getBondById(id);
            connectedBonds.add(bond);
        });

        return connectedBonds;
    }

    getConnectedBondsIds() {
        const connectedBondsIds = new Set<number>();
        const connectedBondsKekule: any[] | [] = KekuleUtils.getLinkedBonds(this.getKekuleNode());

        connectedBondsKekule.forEach((bondKekule: any) => {
            const id = KekuleUtils.getNumericId(bondKekule.id);
            connectedBondsIds.add(id);
        });

        return connectedBondsIds;
    }

    private notifyConnectedBonds(ignoreNotify: number[] = []) {
        const connectedBonds = this.getConnectedBonds();
        connectedBonds.forEach((bond: Bond) => {
            if (ignoreNotify.includes(bond.getId())) {
                return;
            }
            bond.execOuterDrawCommand();
        });
    }

    private removeConnectedBonds(ignoreBondRemove: number[] = []) {
        const ignoreAtomRemove: number[] = [this.getId()];
        const connectedBonds = this.getConnectedBonds();
        console.log("Remove atom", this.getId(), "connected bonds", ...connectedBonds);
        connectedBonds.forEach((bond: Bond) => {
            if (bond && ignoreBondRemove.includes(bond.getId())) {
                return;
            }
            bond?.destroy(ignoreAtomRemove);
        });
    }

    // merge with replaced atom, change location to replaced atom center and remove replaced atom
    mergeWith(replacedAtom: Atom) {
        const newPosition = replacedAtom.attributes.center;

        const currentAtomId = this.getId();
        const currentAtomNeighborsIds = this.getNeighborsIds();
        const replacedAtomNeighborsIds = replacedAtom.getNeighborsIds();
        const replacedAtomBonds = replacedAtom.getConnectedBonds();
        const replacedAtomId = replacedAtom.getId();

        // find neighbors of both current atom and replaced atom
        const neighborsIntersection = new Set(
            [...currentAtomNeighborsIds].filter((x) => replacedAtomNeighborsIds.has(x))
        );

        // iterate over bonds of replaced atom and:
        //      change their start or end atoms to current atom
        //      remove bond if it's other atom is in neighbors intersection
        replacedAtomBonds.forEach((bond: Bond) => {
            const bondStartAtomId = bond.getAttributes().atomStartId;
            const bondEndAtomId = bond.getAttributes().atomEndId;

            const isBondBetweenCurrentAndReplacedAtoms =
                (bondStartAtomId === currentAtomId && bondEndAtomId === replacedAtomId) ||
                (bondStartAtomId === replacedAtomId && bondEndAtomId === currentAtomId);

            const isBondOtherAtomIsANeighborAtom =
                neighborsIntersection.has(bondStartAtomId) || neighborsIntersection.has(bondEndAtomId);

            if (isBondBetweenCurrentAndReplacedAtoms || isBondOtherAtomIsANeighborAtom) {
                bond.destroy([replacedAtomId], false);
                return;
            }

            if (bondStartAtomId === replacedAtomId) {
                bond.updateAttributes({ atomStartId: currentAtomId });
            } else if (bondEndAtomId === replacedAtomId) {
                bond.updateAttributes({ atomEndId: currentAtomId });
            }
        });

        replacedAtom.destroy([], false);
        this.updateAttributes({ center: newPosition });
        this.center = new Vector2(newPosition.x, newPosition.y);
        this.draw();
    }

    protected undraw() {
        // this.backgroundCircle?.remove();
        this.symbolLabel?.remove();
        this.valenceErrorLine?.remove();
        this.valenceErrorRectangle?.remove();
        this.hoverOrSelectShape?.remove();
        // this.backgroundCircle = undefined;
        this.symbolLabel = undefined;
        this.valenceErrorLine = undefined;
        this.valenceErrorRectangle = undefined;
        this.hoverOrSelectShape = undefined;
    }

    // ! should be private
    draw() {
        this.drawLabel();
        this.drawHover();
    }

    execOuterDrawCommand() {
        if (this.lifeStage !== EntityLifeStage.Initialized) return;
        this.calculateImplicitHydrogen();
        this.draw();
    }

    private drawLabel() {
        this.symbolLabel =
            this.symbolLabel ??
            LayersUtils.getLayer(LayersNames.AtomLabelLabel)
                .text("")
                .addClass(styles.atom_label_text)
                .font({
                    family: EditorConstants.atomFontSize,
                    size: EditorConstants.atomFontSize,
                    anchor: "middle",
                })
                .attr({ "pointer-events": "none" })
                .id(IdUtils.getAtomElemId(this.attributes.id));

        const { symbol, center, color } = this.attributes;

        this.symbolLabel.text(symbol).font({
            fill: color,
        });

        // important for tspan to not replace previous text
        this.symbolLabel.build(true);

        this.drawLabelHydrogen(this.symbolLabel);
        // center the symbol by the text with hydrogen but before adding the charge text
        this.symbolLabel.center(center.x, center.y);
        this.drawCharge(this.symbolLabel);

        this.symbolLabel.build(false);

        // reset position for each child of label
        this.symbolLabel.children().each((item) => item.attr({ x: null, y: null, dx: null, dy: null }));

        this.drawValenceError(this.symbolLabel);

        // this.backgroundCircle =
        //     this.backgroundCircle ??
        //     LayersUtils.getLayer(LayersNames.AtomLabelBackground)
        //         .ellipse(0, 0)
        //         // .circle()
        //         .fill("#ffffff")
        //         .id(`${IdUtils.getAtomElemId(this.attributes.id)}_circle`);

        this.bbox = this.symbolLabel.bbox();
        const textBbox = this.bbox;

        // !!! Why 0.8 decrease height?

        this.backgroundRadiuses = {
            x: (textBbox.width / 2) * 1.2,
            y: (textBbox.height / 2) * 1.2,
        };

        // if (!this.backgroundRadiuses.x || !this.backgroundRadiuses.y) return;

        // this.backgroundCircle
        //     .radius(this.backgroundRadiuses.x, this.backgroundRadiuses.y)
        //     .center(textBbox.cx, textBbox.cy);
    }

    calculateEllipsePointOnCircumferenceGivenAngle(angle: number) {
        // this function is used to calculate the point on circumference of the ellipse, so the bond can be drawn with it's correct starting point and end point
        const { center } = this;
        const { x: radiusX, y: radiusY } = this.backgroundRadiuses;
        if (!radiusX || !radiusY) this.drawLabel();
        if (!radiusX || !radiusY) return new Vector2(center.x, center.y);
        const x = center.x + radiusX * Math.cos(angle);
        const y = center.y + radiusY * Math.sin(angle);
        return new Vector2(x, y);
    }

    private moveDrawings(previousCenter: { x: number; y: number }) {
        if (!this.symbolLabel) this.draw();
        if (!this.symbolLabel) return;

        const { center } = this.attributes;

        const dx = previousCenter.x - center.x;
        const dy = previousCenter.y - center.y;

        this.symbolLabel.dmove(-dx, -dy);

        this.valenceErrorLine?.dmove(-dx, -dy);
        // charge affect the center - need to take care of it
        //  this.drawCharge(this.symbolLabel);

        // const textBbox = this.symbolLabel.bbox();

        // this.backgroundCircle!.center(textBbox.cx, textBbox.cy);
        this.drawHover();
    }

    private calculateImplicitHydrogen() {
        this.showValenceError = false;

        if (!this.element) {
            this.valenceErrorLine?.remove();
            this.valenceErrorLine = undefined;
            this.valenceErrorRectangle?.remove();
            this.valenceErrorRectangle = undefined;
            return;
        }

        const connectorObjects = KekuleUtils.getAtomConnectorsObject(this.getKekuleNode());
        const totalBondsSum = KekuleUtils.getBondOrderSum(connectorObjects);

        const hydrogenCount = ValenceUtils.calculateImplicitHydrogenCount(
            this.element.number,
            this.attributes.charge,
            totalBondsSum
        );

        this.implicitHydrogenCount = hydrogenCount;
        if (hydrogenCount < 0) {
            this.showValenceError = true;
        } else {
            this.showValenceError = false;
        }
    }

    private drawValenceError(label: Text) {
        if (!this.showValenceError) {
            this.valenceErrorLine?.remove();
            this.valenceErrorLine = undefined;
            this.valenceErrorRectangle?.remove();
            this.valenceErrorRectangle = undefined;
            return;
        }

        this.valenceErrorRectangle =
            this.valenceErrorRectangle ??
            LayersUtils.getLayer(LayersNames.AtomValenceError)
                .rect(0, 0)
                .fill("none")
                .addClass(styles.atom_label_valence_error_rect)
                .id(`${IdUtils.getAtomElemId(this.attributes.id)}_valence_error`);

        // this.valenceErrorLine =
        //     this.valenceErrorLine ??
        //     LayersUtils.getLayer(LayersNames.AtomLabelLabel)
        //         .line(0, 0, 0, 0)
        //         .fill("#ff0000")
        //         .addClass(styles.atom_label_valence_error_line)
        //         .id(`${IdUtils.getAtomElemId(this.attributes.id)}_valence_error`);

        const textBbox = label.bbox();
        const sizeFactor = 1.2;
        this.valenceErrorRectangle
            .width(textBbox.width * sizeFactor)
            .height(textBbox.height * sizeFactor)
            .center(textBbox.cx, textBbox.cy);
    }

    private drawLabelHydrogen(label: Text) {
        // let hydrogenCount: {
        //     hydrogensBonds: never[];
        //     bonds: never[];
        // }
        // let hydrogenCount = KekuleUtils.getImplicitHydrogensCount(this.nodeObj);

        if (this.implicitHydrogenCount === 0) return;

        let hydrogenCount = this.implicitHydrogenCount;
        let isHydrogenOnLeft = false;
        // if this.attributes.symbol is on list of atoms with hydrogen on left
        const atomsWithHydrogenOnLeft = ["O", "F", "S", "Cl", "Se", "Br", "I"];

        if (atomsWithHydrogenOnLeft.includes(this.attributes.symbol)) {
            isHydrogenOnLeft = true;
        }
        if (this.attributes.symbol !== "H") {
            label.tspan("H").addClass(styles.atom_label_text);
        } else {
            hydrogenCount += 1;
        }

        if (hydrogenCount > 1) {
            label.tspan(`${hydrogenCount}`).addClass(styles.atom_label_hydrogen_text);
        }

        if (isHydrogenOnLeft) {
            label.children()[0].front();
        }
    }

    private drawCharge(label: Text) {
        const { charge } = this.attributes;

        if (charge === 0) return;

        const absCharge = Math.abs(charge);

        let text = "";
        if (charge === -1) {
            text = "-";
        } else if (charge === 1) {
            text = "+";
        } else if (charge < 0) {
            text = `${absCharge}-`;
        } else {
            text = `${absCharge}+`;
        }

        label.tspan(`${text}`).addClass(styles.atom_label_charge_text);
    }

    private drawHover() {
        const { center } = this.attributes;

        this.hoverOrSelectShape?.radius(AtomConstants.HoverRadius).center(center.x, center.y);
    }

    protected setHoverOrSelectShape() {
        this.hoverOrSelectShape =
            this.hoverOrSelectShape ??
            LayersUtils.getLayer(LayersNames.AtomHover)
                .circle()
                .fill({ opacity: 0 })
                .id(`atom_${IdUtils.getAtomElemId(this.getId())}_hover`);
    }

    updateAttributes(newAttributes: Partial<AtomAttributes>, ignoreNotifyBondsIds: number[] = []) {
        const moved =
            newAttributes.center !== undefined &&
            (newAttributes.center.x !== this.attributes.center.x ||
                newAttributes.center.y !== this.attributes.center.y);
        const labelChanged = newAttributes.symbol !== undefined && newAttributes.symbol !== this.attributes.symbol;
        const chargeChanged = newAttributes.charge !== undefined && newAttributes.charge !== this.attributes.charge;

        this.attributes = { ...this.attributes, ...newAttributes };

        if (moved) {
            this.modifyTree(false);
            this.center = new Vector2(newAttributes.center!.x, newAttributes.center!.y);
            this.modifyTree(true);
            this.notifyConnectedBonds(ignoreNotifyBondsIds);
        }

        if (labelChanged) {
            this.element = ElementsData.elementsBySymbolMap.get(this.attributes.symbol);
            this.attributes.color = this.getElementColor(this.element);
            this.notifyConnectedBonds();
        }

        if (chargeChanged || labelChanged) {
            this.calculateImplicitHydrogen();
            this.draw();
        }

        if (moved) {
            this.draw();

            // doesn't work well
            // this.moveDrawings(oldCenter);
        }
    }

    destroy(ignoreBondRemove: number[] = [], IShouldNotifyBonds: boolean = true) {
        if (this.lifeStage === EntityLifeStage.DestroyInit || this.lifeStage === EntityLifeStage.Destroyed) {
            return;
        }
        this.lifeStage = EntityLifeStage.DestroyInit;
        if (this.getKekuleNode()) {
            this.showValenceError = false;
            this.undraw();
            if (IShouldNotifyBonds) {
                this.removeConnectedBonds(ignoreBondRemove);
            }

            this.removeInstanceFromMapAndTree();
            KekuleUtils.destroy(this.getKekuleNode());
            this.nodeObj = undefined;
        }

        this.lifeStage = EntityLifeStage.Destroyed;
    }

    getKekuleNode() {
        this.updateKekuleNode();
        return this.nodeObj;
    }

    updateKekuleNode() {
        if (!this.nodeObj) {
            console.error("no kekule node");
        }
        this.nodeObj?.setCoord2D({ x: this.attributes.center.x, y: this.attributes.center.y });
        this.nodeObj?.setCharge(this.attributes.charge);
        this.nodeObj?.setSymbol(this.attributes.symbol);
    }

    getCenter() {
        return this.center.clone();
    }

    getColor() {
        return this.attributes.color;
    }

    getSymbol() {
        return this.attributes.symbol;
    }

    getAttributes() {
        return _.cloneDeep(this.attributes);
    }

    static generateNewId() {
        const lastId = Atom.instancesCounter;
        Atom.instancesCounter += 1;
        return lastId;
    }
}
