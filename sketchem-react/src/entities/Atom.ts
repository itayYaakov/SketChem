import { AtomConstants } from "@constants/atom.constants";
import { EditorConstants } from "@constants/editor.constant";
import { ElementsData } from "@constants/elements.constants";
import { EntityType, LayersNames } from "@constants/enum.constants";
import { EntitiesMapsStorage, NamedPoint } from "@features/shared/storage";
import { IdUtils } from "@src/utils/IdUtils";
import { KekuleUtils } from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import { Circle, Rect, SVG, Svg, Text } from "@svgdotjs/svg.js";
import { AtomAttributes, IAtom } from "@types";
import Vector2 from "@utils/mathsTs/Vector2";

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

    attributes: AtomAttributes;

    private backgroundRect: Rect | undefined;

    private backgroundCircle: Circle | undefined;

    private hoverCircle: Circle | undefined;

    private text!: Text;

    private nodeObj: any;

    // label: any;
    constructor(args: IAtom) {
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

        const element = ElementsData.elementsMap.get(this.attributes.symbol);
        this.attributes.color = color ?? element?.jmolColor ?? "#000000";

        this.addInstanceToMap();
    }

    private modifyTree(add: boolean = true) {
        const entry = {
            id: this.attributes.id,
            point: this.attributes.center,
            entityType: EntityType.Atom,
        } as NamedPoint;
        if (add) {
            EntitiesMapsStorage.atomsTree.insert(entry);
        } else {
            EntitiesMapsStorage.atomsTree.remove(entry);
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

    // !!! why no usage?
    private removeInstanceFromMap() {
        const map = EntitiesMapsStorage.atomsMap;
        if (map.has(this.attributes.id)) return;
        map.delete(this.attributes.id);
        this.modifyTree(false);
    }

    getId() {
        return this.attributes.id;
    }

    draw() {
        // !!! MOVE TO REDUX ???
        this.addAtomToCanvas();
    }

    moveByDelta(delta: Vector2, ignoreNotifyBondsIds: number[] = []) {
        const newPosition = this.attributes.center.add(delta);
        this.moveTo(newPosition, ignoreNotifyBondsIds);
    }

    moveTo(newPosition: Vector2, ignoreNotifyBondsIds: number[] = []) {
        this.modifyTree(false);
        this.attributes.center = newPosition;
        this.modifyTree(true);
        this.moveAtomOnCanvas();
        this.notifyConnectedBonds(ignoreNotifyBondsIds);
    }

    getConnectedBonds() {
        const { bondsMap } = EntitiesMapsStorage;
        const connectedBonds = new Set<Bond>();
        const connectedBondsKekule: any[] | [] = this.nodeObj.getLinkedBonds();

        connectedBondsKekule.forEach((bondKekule: any) => {
            const id = KekuleUtils.getNumericId(bondKekule.id);
            const bond = EntitiesMapsStorage.getMapInstanceById(bondsMap, id);
            connectedBonds.add(bond);
        });

        return connectedBonds;
    }

    getConnectedBondsIds() {
        const connectedBondsIds = new Set<number>();
        const connectedBondsKekule: any[] | [] = this.nodeObj.getLinkedBonds();

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

    private addAtomToCanvas() {
        const position = this.attributes.center;

        // const element = ElementsData.elementsMap.get(this.attributes.symbol);
        const { color } = this.attributes;
        const textContent = this.attributes.symbol;

        this.text = LayersUtils.getLayer(LayersNames.AtomLabelText)
            .text(textContent)
            .font({
                fill: color,
                "font-weight": "bold",
                family: EditorConstants.atomFontSize,
                size: EditorConstants.atomFontSize,
                anchor: "middle",
            })
            .center(position.x, position.y)
            .id(IdUtils.getAtomElemId(this.attributes.id));

        const textBbox = this.text.bbox();

        this.backgroundCircle = LayersUtils.getLayer(LayersNames.AtomLabelBackground)
            .circle()
            .radius((Math.max(textBbox.width, textBbox.height) / 2) * 1.1)
            .fill("#ffffff")
            .center(textBbox.cx, textBbox.cy)
            .id(`${IdUtils.getAtomElemId(this.attributes.id)}_circle`);

        // this.backgroundRect = LayersUtils.getLayer(LayersNames.AtomLabelBackground)
        //     .rect(textBbox.width * 1.1, textBbox.height * 1.1)
        //     .fill("#ffffff")
        //     // .center(position.x, position.y)
        //     .move(textBbox.x, textBbox.y)
        //     .id(`${IdUtils.getAtomElemId(this.attributes.id)}_circle`);

        this.hoverCircle = LayersUtils.getLayer(LayersNames.AtomLabelHover)
            // .circle(Math.max(textBbox.width, textBbox.height) * 1.8)
            .circle(AtomConstants.HoverRadius * 2)
            // .fill({ color: "#0000ff", opacity: 0.2 })
            .fill("none")
            .stroke({ color: "#f06", opacity: 0.6, width: 5 })
            .center(position.x, position.y)
            .id(`${IdUtils.getAtomElemId(this.attributes.id)}_circle_hover`)
            .hide();
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
        return this.attributes.center;
    }

    private moveAtomOnCanvas() {
        const position = this.attributes.center;

        // const element = ElementsData.elementsMap.get(this.attributes.symbol);
        const { color } = this.attributes;
        const textContent = this.attributes.symbol;

        // ??? find a better option
        if (this.text.text() !== textContent) {
            this.text.clear();
            this.text.text(textContent);
            this.text.font({ fill: color });
        }

        this.text.center(position.x, position.y);

        const textBbox = this.text.bbox();

        const radius = (Math.max(textBbox.width, textBbox.height) / 2) * 1.1;
        this.backgroundCircle?.radius(radius).center(textBbox.cx, textBbox.cy);

        // this.backgroundRect
        //     ?.width(textBbox.width * 1.1)
        //     .height(textBbox.height * 1.1)
        //     .move(textBbox.x, textBbox.y);

        this.hoverCircle?.center(position.x, position.y);
    }

    static generateNewId() {
        const lastId = Atom.instancesCounter;
        Atom.instancesCounter += 1;
        return lastId;
    }
}
