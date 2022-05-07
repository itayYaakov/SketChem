import { AtomConstants } from "@constants/atom.constants";
import { EditorConstants } from "@constants/editor.constant";
import { ElementsData } from "@constants/elements.constants";
import { Circle, SVG, Svg, Text } from "@svgdotjs/svg.js";
import { AtomAttributes } from "@types";
import Vector2 from "@utils/mathsTs/Vector2";

export class Atom {
    static instancesCounter = 0;

    static map = new Map<number, Atom>();

    static DefaultAttributes: AtomAttributes = {
        id: -1,
        charge: 0,
        symbol: "C",
        color: "#ffffff",
        center: Vector2.zero,
    };

    attributes: AtomAttributes;

    // label: any;
    constructor(attrs: Partial<AtomAttributes>) {
        const id = attrs.id && attrs.id > 0 ? attrs.id : Atom.generateNewId();
        this.attributes = { ...Atom.DefaultAttributes, ...attrs, id };
        const element = ElementsData.elementsMap.get(this.attributes.symbol);
        this.attributes.color = attrs?.color || element?.jmolColor || "#000000";
        // this.charge = getValueOrDefault(attributes.charge, Atom.attrlist.isotope);
        this.addInstanceToMap();
    }

    addInstanceToMap() {
        if (Atom.map.has(this.attributes.id)) {
            console.error("Object already exists!");
        }
        if (Atom.map.has(this.attributes.id)) return;
        Atom.map.set(this.attributes.id, this);
    }

    removeInstanceFromMap() {
        if (!Atom.map.has(this.attributes.id)) return;
        Atom.map.delete(this.attributes.id);
    }

    getId() {
        return this.attributes.id;
    }

    draw(canvas: Svg) {
        // !!! MOVE TO REDUX ???
        const result = this.AtomAdd(canvas);
        if (!result) {
            console.error("result=", result, "in atom.ts");
        }
    }

    move(canvas: Svg, newPostion: Vector2) {
        this.attributes.center = newPostion;
        this.AtomMove(canvas);
    }

    AtomAdd(canvas: Svg): Text | undefined {
        const position = this.attributes.center;

        // const element = ElementsData.elementsMap.get(this.attributes.symbol);
        const { color } = this.attributes;
        const textContent = this.attributes.symbol;

        // const circle = canvas.circle(10).fill("#ffffff").move(position.x, position.y);
        const circle = canvas
            .circle(10)
            .fill("#ffffff")
            .center(position.x, position.y)
            .id(`${AtomConstants.getElemId(this.attributes.id)}_circle`);

        const text = canvas.text(textContent);
        text.center(position.x, position.y).font({
            fill: color,
            family: EditorConstants.atomFontSize,
            size: EditorConstants.atomFontSize,
            anchor: "middle",
        });

        text.insertAfter(circle);

        text.id(AtomConstants.getElemId(this.attributes.id));

        return text;
    }

    AtomMove(canvas: Svg): Text | undefined {
        const text: Text | null = SVG(`#${AtomConstants.getElemId(this.attributes.id)}`) as Text;
        const circle: Circle | null = SVG(`#${AtomConstants.getElemId(this.attributes.id)}_circle`) as Circle;
        if (!text) {
            console.error("Couldn't find text element", text);
        }
        const position = this.attributes.center;

        // const element = ElementsData.elementsMap.get(this.attributes.symbol);
        const { color } = this.attributes;
        const textContent = this.attributes.symbol;

        // ??? find a better option
        if (text.text() !== textContent) {
            text.clear();
            text.text(textContent);
            text.font({ fill: color });
        }

        text.center(position.x, position.y);
        circle!.center(position.x, position.y);

        return text;
    }

    static getElementStringId(idNum: number) {
        return `atom_${idNum}`;
    }

    static getInstanceById(idNum: number) {
        return Atom.map.get(idNum);
    }

    static generateNewId() {
        const lastId = Atom.instancesCounter;
        Atom.instancesCounter += 1;
        return lastId;
    }
}
