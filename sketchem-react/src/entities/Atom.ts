import { AtomConstants } from "@constants/atom.constants";
import { EditorConstants } from "@constants/editor.constant";
import { ElementsData } from "@constants/elements.constants";
import { LayersNames } from "@constants/enum.constants";
import { itemsMaps } from "@features/shared/storage";
import { IdUtils } from "@src/utils/IdUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import { Circle, Rect, SVG, Svg, Text } from "@svgdotjs/svg.js";
import { AtomAttributes } from "@types";
import Vector2 from "@utils/mathsTs/Vector2";

export class Atom {
    static instancesCounter = 1;

    static map = new Map<number, Atom>();

    static DefaultAttributes: AtomAttributes = {
        id: -1,
        charge: 0,
        symbol: "C",
        color: "#ffffff",
        center: Vector2.zero(),
    };

    attributes: AtomAttributes;

    private backgroundRect: Rect | undefined;

    private hoverCircle: Circle | undefined;

    private text!: Text;

    // label: any;
    constructor(attrs: Partial<AtomAttributes>) {
        const id = attrs.id && attrs.id > 0 ? attrs.id : Atom.generateNewId();
        this.attributes = { ...Atom.DefaultAttributes, ...attrs, id };
        const element = ElementsData.elementsMap.get(this.attributes.symbol);
        this.attributes.color = attrs?.color || element?.jmolColor || "#000000";
        // this.charge = getValueOrDefault(attributes.charge, Atom.attrlist.isotope);
        this.addInstanceToMap();
    }

    private modifyTree(add: boolean = true) {
        const entry = { id: this.attributes.id, point: this.attributes.center };
        if (add) {
            itemsMaps.atoms.insert(entry);
        } else {
            itemsMaps.atoms.remove(entry);
        }
    }

    private addInstanceToMap() {
        if (Atom.map.has(this.attributes.id)) {
            console.error("Object already exists!");
        }
        if (Atom.map.has(this.attributes.id)) return;
        Atom.map.set(this.attributes.id, this);
        this.modifyTree(true);
    }

    // !!! why no usage?
    private removeInstanceFromMap() {
        if (!Atom.map.has(this.attributes.id)) return;
        Atom.map.delete(this.attributes.id);
        this.modifyTree(false);
    }

    getId() {
        return this.attributes.id;
    }

    draw() {
        // !!! MOVE TO REDUX ???
        this.AtomAdd();
    }

    move(newPostion: Vector2) {
        this.modifyTree(false);
        this.attributes.center = newPostion;
        this.modifyTree(true);
        this.AtomMove();
    }

    private AtomAdd() {
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

        this.backgroundRect = LayersUtils.getLayer(LayersNames.AtomLabelBackground)
            .rect(textBbox.width * 1.1, textBbox.height * 1.1)
            .fill("#ffffff")
            // .center(position.x, position.y)
            .move(textBbox.x, textBbox.y)
            .id(`${IdUtils.getAtomElemId(this.attributes.id)}_circle`);

        this.hoverCircle = LayersUtils.getLayer(LayersNames.AtomLabelHover)
            .circle(Math.max(textBbox.width, textBbox.height) * 1.8)
            .fill("none")
            .stroke({ color: "#f06", opacity: 0.6, width: 5 })
            .center(position.x, position.y)
            .id(`${IdUtils.getAtomElemId(this.attributes.id)}_circle_hover`)
            .hide();
    }

    Select(isSelected: boolean) {
        if (!this.hoverCircle) return;
        if (isSelected) {
            this.hoverCircle.show();
            // this.hoverCircle.attr({ filter: "drop-shadow(0px 0px 5px #23c081)" });
        } else {
            this.hoverCircle.hide();
            // circle.attr({ filter: "" });
        }
    }

    private AtomMove() {
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

        this.backgroundRect
            ?.width(textBbox.width * 1.1)
            .height(textBbox.height * 1.1)
            .move(textBbox.x, textBbox.y);

        const radius = Math.max(textBbox.width, textBbox.height) * 1.8;
        this.hoverCircle?.radius(radius).center(position.x, position.y);
    }

    static getInstanceById(idNum: number) {
        const atom = Atom.map.get(idNum);
        if (!atom) {
            throw new Error(`Couldn't find atom with id ${idNum}`);
        }
        return atom;
    }

    static generateNewId() {
        const lastId = Atom.instancesCounter;
        Atom.instancesCounter += 1;
        return lastId;
    }
}
