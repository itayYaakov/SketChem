import { BondConstants } from "@constants/bond.constants";
import { BondStereoKekule, BondType } from "@constants/enum.constants";
import { itemsMaps } from "@features/shared/storage";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Line, Rect, SVG, Svg } from "@svgdotjs/svg.js";
import { BondAttributes } from "@types";
import * as VectorUtils from "@utils/vector";

// !!! MOVE TO REDUX??
import { Atom } from "./Atom";

export class Bond {
    static instancesCounter = 0;

    static map = new Map<number, Bond>();

    // just a demo for now
    static DefaultAttributes: Partial<BondAttributes> = {
        type: BondType.Single,
        stereo: BondStereoKekule.NONE,
    };

    attributes: BondAttributes;

    elem: Rect | undefined;

    startAtom: Atom | undefined;

    endAtom: Atom | undefined;

    center!: Vector2;

    // label: any;
    constructor(
        type: BondType,
        stereo: BondStereoKekule,
        atomStartId: number,
        atomEndId: number,
        optional_id?: number
    ) {
        // this.attributes = { ...Bond.DefaultAttributes, ...attributes };
        const id = optional_id ?? Bond.generateNewId();
        this.attributes = { ...Bond.DefaultAttributes, id, type, stereo, atomStartId, atomEndId };
        this.startAtom = Atom.getInstanceById(this.attributes.atomStartId);
        this.endAtom = Atom.getInstanceById(this.attributes.atomEndId);
        this.setBondCenter();
        if (!this.startAtom || !this.endAtom) {
            console.error("Couldn't find Start atom", this.startAtom);
            console.error("Or Couldn't find End atom", this.endAtom);
            return;
        }
        console.log(this.attributes.type);
        // this.label = attributes.label;
        // this.charge = getValueOrDefault(attributes.charge, Atom.attrlist.isotope);
        this.addInstanceToMap();
    }

    setBondCenter(rect?: any) {
        if (!this.startAtom || !this.endAtom) {
            this.center = Vector2.zero();
            return;
        }
        const center = this.startAtom.attributes.center.add(this.endAtom.attributes.center);
        this.center = center.scale(0.5);
        this.center.x -= BondConstants.padding / 2;
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
        const entry = { id: this.attributes.id, point: this.center };
        if (add) {
            itemsMaps.bonds.insert(entry);
        } else {
            itemsMaps.bonds.remove(entry);
        }
    }

    addInstanceToMap() {
        if (Bond.map.has(this.attributes.id)) {
            console.error("Object already exists!");
        }
        if (Bond.map.has(this.attributes.id)) return;
        Bond.map.set(this.attributes.id, this);
        this.modifyTree(true);
    }

    removeInstanceFromMap() {
        if (!Bond.map.has(this.attributes.id)) return;
        Bond.map.delete(this.attributes.id);
        this.modifyTree(true);
    }

    getId() {
        return this.attributes.id;
    }

    draw(canvas: Svg) {
        // !!! MOVE TO REDUX ???
        const result = this.BondAdd(canvas);
        if (!result) {
            console.error("result=", result, "in Bond.ts");
        }
    }

    BondAdd(canvas: Svg): Rect | undefined {
        const startAtom = Atom.getInstanceById(this.attributes.atomStartId);
        const endAtom = Atom.getInstanceById(this.attributes.atomEndId);
        if (!startAtom) {
            console.error("Couldn't find start atom", startAtom, this.attributes.atomStartId);
            return undefined;
        }
        if (!endAtom) {
            console.error("Couldn't find end atom", endAtom, this.attributes.atomEndId);
            return undefined;
        }
        const startPosition = startAtom.attributes.center;
        const endPosition = endAtom.attributes.center;

        const angle = VectorUtils.radToDeg(endPosition.angle(startPosition));
        // if (angle === 0 || angle === 90) return;
        const distance = startPosition.distance(endPosition);

        const rect = canvas.rect(BondConstants.padding, distance);
        if (this.attributes.stereo === BondStereoKekule.NONE) {
            rect.fill(`url(#def_${BondType[this.attributes.type]})`);
        } else {
            console.log("stereo=", this.attributes.stereo, BondStereoKekule[this.attributes.stereo]);
            rect.fill(`url(#def_${BondStereoKekule[this.attributes.stereo]})`);
        }

        rect.move(startAtom.attributes.center.x, startAtom.attributes.center.y).id(
            BondConstants.getElemId(this.attributes.id)
        );

        switch (this.attributes.stereo) {
            case BondStereoKekule.DOWN:
            case BondStereoKekule.UP:
                rect.attr("clip-path", `url(#def_${BondConstants.poly_clip_id})`);
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

        this.setBondCenter(rect);
        canvas.circle(8).move(this.center.x, this.center.y).fill("#ff0000");
        return rect;
    }

    Select(isSelected: boolean) {
        const rect: Rect | null = SVG(`#${BondConstants.getElemId(this.attributes.id)}`) as Rect;
        if (isSelected) {
            rect.attr({ filter: `url(#def_${BondConstants.hoverFilter})` });

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

    BondMove(canvas: Svg, movedAtomId: number | undefined) {
        const rect: Rect | null = SVG(`#${BondConstants.getElemId(this.attributes.id)}`) as Rect;
        if (!rect) {
            console.error(
                "rect is undefined!",
                `#${BondConstants.getElemId(this.attributes.id)}`,
                rect,
                this.attributes.id
            );
            return;
        }

        if (rect == null) return;

        const startAtom = Atom.getInstanceById(this.attributes.atomStartId);
        const endAtom = Atom.getInstanceById(this.attributes.atomEndId);
        if (!startAtom) {
            console.error("Couldn't find start atom", startAtom, this.attributes.atomStartId);
            return;
        }
        if (!endAtom) {
            console.error("Couldn't find end atom", endAtom, this.attributes.atomEndId);
            return;
        }
        const startPosition = startAtom.attributes.center;
        const endPosition = endAtom.attributes.center;

        if (movedAtomId) {
            if (movedAtomId === startAtom.attributes.id) {
                rect.move(startAtom.attributes.center.x, startAtom.attributes.center.y);
            }
            // if (movedAtomId === endAtom.attributes.id && movedAtomId > 1) {
            //     rect.move(endAtom.attributes.center.x, endAtom.attributes.center.y);
            // }
        }

        const angle = VectorUtils.radToDeg(endPosition.angle(startPosition));
        // if (angle === 0 || angle === 90) return;
        const distance = startPosition.distance(endPosition);

        rect.height(distance);
        rect.transform({
            translate: [-BondConstants.padding / 2, 0],
            origin: "top center",
            rotate: angle - 90,
        });
        this.setBondCenter(rect);
    }

    move(canvas: Svg, movedAtomId: number | undefined) {
        this.modifyTree(false);
        this.BondMove(canvas, movedAtomId);
        this.modifyTree(true);
    }

    static getElementStringId(idNum: number) {
        return BondConstants.getElemId(idNum);
    }

    static getInstanceById(idNum: number) {
        return Bond.map.get(idNum);
    }

    static generateNewId() {
        const lastId = Bond.instancesCounter;
        Bond.instancesCounter += 1;
        return lastId;
    }
}
