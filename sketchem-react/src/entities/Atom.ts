import { AtomConstants } from "@constants/atom.constants";
import { EditorConstants } from "@constants/editor.constant";
import { ElementsData } from "@constants/elements.constants";
import { itemsMaps } from "@features/shared/storage";
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
        center: Vector2.zero(),
    };

    attributes: AtomAttributes;

    mainCircle: Circle | undefined;

    hoverCircle: Circle | undefined;

    // label: any;
    constructor(attrs: Partial<AtomAttributes>) {
        const id = attrs.id && attrs.id > 0 ? attrs.id : Atom.generateNewId();
        this.attributes = { ...Atom.DefaultAttributes, ...attrs, id };
        const element = ElementsData.elementsMap.get(this.attributes.symbol);
        this.attributes.color = attrs?.color || element?.jmolColor || "#000000";
        // this.charge = getValueOrDefault(attributes.charge, Atom.attrlist.isotope);
        this.addInstanceToMap();
    }

    modifyTree(add: boolean = true) {
        const entry = { id: this.attributes.id, point: this.attributes.center };
        if (add) {
            itemsMaps.atoms.insert(entry);
        } else {
            itemsMaps.atoms.remove(entry);
        }
    }

    addInstanceToMap() {
        if (Atom.map.has(this.attributes.id)) {
            console.error("Object already exists!");
        }
        if (Atom.map.has(this.attributes.id)) return;
        Atom.map.set(this.attributes.id, this);
        this.modifyTree(true);
    }

    removeInstanceFromMap() {
        if (!Atom.map.has(this.attributes.id)) return;
        Atom.map.delete(this.attributes.id);
        this.modifyTree(false);
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
        this.modifyTree(false);
        this.attributes.center = newPostion;
        this.modifyTree(true);
        this.AtomMove(canvas);
    }

    AtomAdd(canvas: Svg): Text | undefined {
        const position = this.attributes.center;

        // const element = ElementsData.elementsMap.get(this.attributes.symbol);
        const { color } = this.attributes;
        const textContent = this.attributes.symbol;

        // const circle = canvas.circle(10).fill("#ffffff").move(position.x, position.y);
        this.mainCircle = canvas
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

        text.insertAfter(this.mainCircle);

        text.id(AtomConstants.getElemId(this.attributes.id));

        return text;
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
