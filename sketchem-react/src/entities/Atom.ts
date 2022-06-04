import { AtomConstants } from "@constants/atom.constants";
import { EditorConstants } from "@constants/editor.constant";
import { ElementsData, PtElement } from "@constants/elements.constants";
import { EntityLifeStage, EntityType, LayersNames } from "@constants/enum.constants";
import { editorObj } from "@features/editor/Editor";
import { EntitiesMapsStorage, NamedPoint } from "@features/shared/storage";
import { IdUtils } from "@src/utils/IdUtils";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import * as ValenceUtils from "@src/utils/ValenceUtils";
import styles from "@styles/index.module.scss";
import { Circle, Rect, SVG, Svg, Text, Tspan } from "@svgdotjs/svg.js";
import { ActionItem, AtomAttributes, IAtom } from "@types";
import Vector2 from "@utils/mathsTs/Vector2";
import clsx from "clsx";

import type { Bond } from "./Bond";

export class Atom {
    static instancesCounter = 1;

    static DefaultAttributes: AtomAttributes = {
        id: -1,
        charge: 0,
        symbol: "C",
        color: "#ffffff",
        center: Vector2.zero(),
    };

    private attributes: AtomAttributes;

    private backgroundRect: Rect | undefined;

    private backgroundCircle: Circle | undefined;

    private chargeBackgroundCircle: Circle | undefined;

    private hoverCircle: Circle | undefined;

    private symbolLabel: Text | undefined;

    private chargeLabel: Text | undefined;

    private nodeObj: any;

    private lastTreeNode: NamedPoint | undefined;

    private lifeStage: EntityLifeStage;

    private element: PtElement | undefined;

    constructor(args: IAtom) {
        this.lifeStage = EntityLifeStage.New;
        let id;
        let color;
        if (args.props) {
            const { props } = args;
            // !!! make sure id is valid - a number, and greater than instance counter
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
            const coord2D = this.nodeObj.getCoord2D();
            const center = new Vector2(coord2D.x, coord2D.y);
            this.attributes = { ...Atom.DefaultAttributes, charge, symbol, center, id };
        } else {
            throw new Error(`Atom constructor not implement args = ${args}`);
        }

        const elementsMap = ElementsData.elementsBySymbolMap;
        this.element = elementsMap.get(this.attributes.symbol);
        this.attributes.color = this.getColor(this.element, color);
        this.attributes.center = this.attributes.center.clone();

        this.addInstanceToMap();
        this.lifeStage = EntityLifeStage.Initialized;

        const historyItem: ActionItem = {
            command: "ADD",
            type: "ATOM",
            atomAttributes: this.attributes,
            bondAttributes: undefined,
        };
        editorObj?.addHistoryItem(historyItem);
        editorObj?.sealHistory();
    }

    getColor(element: PtElement | undefined, color?: string) {
        return color ?? element?.customColor ?? element?.cpkColor ?? element?.jmolColor ?? "#000000";
        // return color ?? element?.customColor ?? element?.jmolColor ?? element?.cpkColor ?? "#000000";
    }

    private modifyTree(add: boolean = true) {
        if (add) {
            this.lastTreeNode = {
                id: this.attributes.id,
                point: this.attributes.center,
                entityType: EntityType.Atom,
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

    private addInstanceToMap() {
        const map = EntitiesMapsStorage.atomsMap;
        if (map.has(this.attributes.id)) {
            console.error("Object already exists!");
        }
        if (map.has(this.attributes.id)) return;
        map.set(this.attributes.id, this);
        this.modifyTree(true);
    }

    private removeInstanceFromMapAndTree() {
        const map = EntitiesMapsStorage.atomsMap;
        if (map.has(this.attributes.id)) map.delete(this.attributes.id);
        this.modifyTree(false);
    }

    getId() {
        return this.attributes.id;
    }

    moveByDelta(delta: Vector2, ignoreNotifyBondsIds: number[] = []) {
        const newPosition = this.attributes.center.addNew(delta);
        this.updateAttributes({ center: newPosition }, ignoreNotifyBondsIds);
    }

    getConnectedBonds() {
        const connectedBonds = new Set<Bond>();
        const connectedBondsKekule: any[] | [] = KekuleUtils.getLinkedBonds(this.nodeObj);

        connectedBondsKekule.forEach((bondKekule: any) => {
            const id = KekuleUtils.getNumericId(bondKekule.id);
            const bond = EntitiesMapsStorage.getBondById(id);
            connectedBonds.add(bond);
        });

        return connectedBonds;
    }

    getConnectedBondsIds() {
        const connectedBondsIds = new Set<number>();
        const connectedBondsKekule: any[] | [] = KekuleUtils.getLinkedBonds(this.nodeObj);

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
            bond.movedByAtomId(this.attributes.id);
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

    private undraw() {
        this.backgroundRect?.remove();
        this.backgroundCircle?.remove();
        this.chargeBackgroundCircle?.remove();
        this.hoverCircle?.remove();
        this.symbolLabel?.remove();
        this.chargeLabel?.remove();
    }

    // ! should be private
    draw() {
        this.drawLabel();
        this.drawCharge();
        this.drawHover();
    }

    private drawLabel() {
        this.symbolLabel =
            this.symbolLabel ??
            LayersUtils.getLayer(LayersNames.AtomLabelLabel)
                .text("")
                .hide()
                .addClass(styles.atom_label_text)
                .font({
                    family: EditorConstants.atomFontSize,
                    size: EditorConstants.atomFontSize,
                    anchor: "middle",
                })
                .attr({ "text-anchor": "middle" })
                .id(IdUtils.getAtomElemId(this.attributes.id));

        const { symbol, center, color } = this.attributes;

        this.symbolLabel.text(symbol).font({
            fill: color,
        });

        // important for tspan to not replace previous text
        this.symbolLabel.build(true);

        this.drawLabelHydrogen(this.symbolLabel);
        this.symbolLabel.build(false);
        this.symbolLabel.center(center.x, center.y);

        // reset position for each child of label
        this.symbolLabel.children().each((item) => item.attr({ x: null, y: null, dx: null, dy: null }));

        this.backgroundCircle =
            this.backgroundCircle ??
            LayersUtils.getLayer(LayersNames.AtomLabelBackground)
                .circle()
                .fill("#ffffff")
                .id(`${IdUtils.getAtomElemId(this.attributes.id)}_circle`);

        const textBbox = this.symbolLabel.bbox();

        // !!! Why 0.8 decrease height?
        // LayersUtils.getLayer(LayersNames.AtomLabelHover)
        //     .rect(textBbox.width, textBbox.height * 0.8)
        //     .cx(textBbox.cx)
        //     .cy(textBbox.cy)
        //     .fill("#ff00a8");

        this.backgroundCircle
            .radius((Math.max(textBbox.width, textBbox.height * 0.8) / 2) * 1)
            // .radius((Math.max(textBbox.width, textBbox.height) / 2) * 1)
            .center(textBbox.cx, textBbox.cy);

        this.symbolLabel.show();
    }

    private drawLabelHydrogen(label: Text) {
        if (!this.element) return;

        const hydrogenConnectorsObject = KekuleUtils.getAtomConnectorsObjectWithHydrogenData(this.nodeObj);
        const { hydrogensBonds, nonHydrogensBonds } = hydrogenConnectorsObject;
        const hydrogenBondsSum = KekuleUtils.getBondOrderSum(hydrogensBonds);
        const nonHydrogenBondsSum = KekuleUtils.getBondOrderSum(nonHydrogensBonds);
        const totalBondsSum = hydrogenBondsSum + nonHydrogenBondsSum;

        // !!! *** for debug ***
        const allBondsForDebug = KekuleUtils.getAtomConnectorsList(this.nodeObj);
        const allBondsSum = KekuleUtils.getBondOrderSum(allBondsForDebug);
        if (totalBondsSum !== allBondsSum) {
            console.error("Bonds sum mismatch", totalBondsSum, allBondsSum);
        }
        // !!! *** for debug ***

        let hydrogenCount = ValenceUtils.calculateImplicitHydrogenCount(
            this.element?.number,
            this.attributes.charge,
            hydrogenBondsSum,
            totalBondsSum
        );

        // let hydrogenCount: {
        //     hydrogensBonds: never[];
        //     bonds: never[];
        // }
        // let hydrogenCount = KekuleUtils.getImplicitHydrogensCount(this.nodeObj);
        if (hydrogenCount === 0) {
            return;
        }

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

    private drawCharge() {
        const { charge, center, color } = this.attributes;

        if (charge === 0) {
            this.chargeLabel?.hide();
            return;
        }

        const absCharge = Math.abs(charge);

        this.chargeLabel =
            this.chargeLabel ??
            LayersUtils.getLayer(LayersNames.AtomLabelCharge)
                .text("")
                .addClass(styles.atom_label_text)
                .font({
                    // "font-weight": "bold",
                    family: EditorConstants.atomFontSize,
                    size: EditorConstants.atomFontSize,
                    anchor: "middle",
                })
                .id(IdUtils.getAtomElemId(this.attributes.id));

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

        const labelTextBbox = this.symbolLabel!.bbox();

        let chargeOffset = { x: labelTextBbox.width / 2, y: -labelTextBbox.height / 2 };

        this.chargeLabel
            .show()
            .text(text)
            .font({
                fill: color,
            })
            .center(center.x, center.y)
            .dmove(chargeOffset.x, chargeOffset.y);

        let chargeTextBbox = this.chargeLabel.bbox();
        chargeOffset = { x: chargeTextBbox.width / 2, y: 0 };

        this.chargeLabel.dmove(chargeOffset.x, chargeOffset.y);

        chargeTextBbox = this.chargeLabel.bbox();

        this.chargeBackgroundCircle =
            this.chargeBackgroundCircle ??
            LayersUtils.getLayer(LayersNames.AtomLabelBackground)
                .circle()
                .fill("#ffffff")
                .id(`${IdUtils.getAtomElemId(this.attributes.id)}_circle_charge`);

        this.chargeBackgroundCircle
            .radius(Math.max(chargeTextBbox.width, chargeTextBbox.height) / 2)
            .center(chargeTextBbox.cx, chargeTextBbox.cy);
    }

    private drawHover() {
        const { center } = this.attributes;

        this.hoverCircle =
            this.hoverCircle ??
            LayersUtils.getLayer(LayersNames.AtomLabelHover)
                .circle()
                .fill("none")
                .stroke({ color: "#f06", opacity: 0.6, width: 5 })
                .id(`${IdUtils.getAtomElemId(this.attributes.id)}_circle_hover`)
                .hide();

        this.hoverCircle.radius(AtomConstants.HoverRadius).center(center.x, center.y);
    }

    select(isSelected: boolean) {
        if (!this.hoverCircle) return;
        if (isSelected) {
            this.hoverCircle.show();
            // this.hoverCircle.attr({ filter: "drop-shadow(0px 0px 5px #23c081)" });
        } else {
            this.hoverCircle.hide();
            // circle.attr({ filter: "" });
        }
    }

    getKekuleNode() {
        return this.nodeObj;
    }

    getCenter() {
        return this.attributes.center.clone();
    }

    getSymbol() {
        return this.attributes.symbol;
    }

    getAttributes() {
        // return a copy of attributes
        return { ...this.attributes };
    }

    updateAttributes(newAttributes: Partial<AtomAttributes>, ignoreNotifyBondsIds: number[] = []) {
        this.attributes = { ...this.attributes, ...newAttributes };

        const moved = newAttributes.center !== undefined;
        const redrawCharge = newAttributes.charge !== undefined || moved;
        const redrawLabel = newAttributes.charge !== undefined || newAttributes.symbol !== undefined || moved;

        if (moved) {
            this.modifyTree(false);
            // !!! remove kekule update in here
            this.nodeObj.setCoord2D({ x: newAttributes.center!.x, y: newAttributes.center!.y });
            this.draw();
            this.modifyTree(true);
            this.notifyConnectedBonds(ignoreNotifyBondsIds);
        } else {
            if (redrawCharge) {
                this.nodeObj.setCharge(this.attributes.charge);
                this.drawCharge();
                // !!! see if this can be removed
                this.drawLabel();
            }
            if (redrawLabel) {
                this.nodeObj.setSymbol(this.attributes.symbol);
                this.element = ElementsData.elementsBySymbolMap.get(this.attributes.symbol);
                this.attributes.color = this.getColor(this.element);
                this.drawLabel();
                this.drawCharge();
            }
        }

        const historyItem: ActionItem = {
            command: "CHANGE",
            type: "ATOM",
            atomAttributes: this.attributes,
            bondAttributes: undefined,
        };

        // addHistoryItem(historyItem);
    }

    destroy(ignoreBondRemove: number[] = [], IShouldNotifyBonds: boolean = true) {
        if (this.lifeStage === EntityLifeStage.DestroyInit || this.lifeStage === EntityLifeStage.Destroyed) {
            return;
        }
        this.lifeStage = EntityLifeStage.DestroyInit;
        if (this.nodeObj) {
            this.undraw();
            if (IShouldNotifyBonds) {
                this.removeConnectedBonds(ignoreBondRemove);
            }

            this.removeInstanceFromMapAndTree();
            KekuleUtils.destroy(this.nodeObj);
            this.nodeObj = undefined;
        }
        const historyItem: ActionItem = {
            command: "REMOVE",
            type: "ATOM",
            atomAttributes: this.attributes,
            bondAttributes: undefined,
        };

        // addHistoryItem(historyItem);

        this.lifeStage = EntityLifeStage.Destroyed;
    }

    static generateNewId() {
        const lastId = Atom.instancesCounter;
        Atom.instancesCounter += 1;
        return lastId;
    }
}
