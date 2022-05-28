import { EditorConstants } from "@constants/editor.constant";
import { BondOrder, BondStereoKekule, LayersNames } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { EntitiesMapsStorage } from "@features/shared/storage";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { BondAttributes, IAtom, IBond, MouseEventCallBackProperties } from "@types";

import { ActiveToolbarItem } from "../ToolbarItem";

enum MouseMode {
    Default = -1,
    EmptyPress = 1,
    atomPressed,
    bondPressed,
}
export class BondToolBarItem implements ActiveToolbarItem {
    name: string;

    bondOrder: BondOrder;

    bondStereo: BondStereoKekule;

    keyboardKeys?: string[];

    mode: MouseMode;

    context: {
        startAtom?: Atom;
        endAtom?: Atom;
        bond?: Bond;
        rotation?: number;
    };

    constructor(name: string, bondType: BondOrder, bondStereo: BondStereoKekule, keyboardKeys?: string[]) {
        this.name = name;
        this.bondOrder = bondType;
        this.bondStereo = bondStereo;
        this.keyboardKeys = keyboardKeys ?? undefined;
        this.mode = MouseMode.Default;
        this.context = {};
    }

    onMouseDown(eventHolder: MouseEventCallBackProperties) {
        this.context = {};
        this.mode = MouseMode.Default;
        const { mouseDownLocation } = eventHolder;

        const { getAtomById, atomAtPoint, getBondById, bondAtPoint } = EntitiesMapsStorage;

        const atomWasPressed = atomAtPoint(mouseDownLocation);
        if (atomWasPressed) {
            this.mode = MouseMode.atomPressed;
            const atom = getAtomById(atomWasPressed.id);
            this.context.startAtom = atom;
            return;
        }

        const bondWasPressed = bondAtPoint(mouseDownLocation);
        if (bondWasPressed) {
            this.mode = MouseMode.bondPressed;
            const bond = getBondById(bondWasPressed.id);
            const { order: pressedBondOrder, stereo: pressedBondStereo } = bond.getAttributes();
            const pressedBondNoneStereo = pressedBondStereo === BondStereoKekule.NONE;
            if (
                this.bondOrder === BondOrder.Single &&
                this.bondStereo === BondStereoKekule.NONE &&
                pressedBondNoneStereo
            ) {
                let newBondOrder;
                switch (pressedBondOrder) {
                    case BondOrder.Single:
                        newBondOrder = BondOrder.Double;
                        break;
                    case BondOrder.Double:
                        newBondOrder = BondOrder.Triple;
                        break;
                    case BondOrder.Triple:
                        newBondOrder = BondOrder.Single;
                        break;
                    default:
                        return;
                }
                bond.updateAttributes({ order: newBondOrder });
                return;
            }

            const newAttributes: Partial<BondAttributes> = {};
            if (pressedBondOrder !== this.bondOrder) newAttributes.order = this.bondOrder;
            if (pressedBondStereo !== this.bondStereo) newAttributes.stereo = this.bondStereo;
            if (newAttributes) bond.updateAttributes(newAttributes);
            return;
        }

        this.mode = MouseMode.EmptyPress;
        const startAtomCenter = mouseDownLocation;
        this.context.startAtom = new Atom({ props: { symbol: "C", center: startAtomCenter } } as IAtom);
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation, mouseCurrentLocation } = eventHolder;

        if (this.mode === MouseMode.Default) {
            // !!! add hover
            return;
        }

        // if (this.mode === MouseMode.atomPressed) {
        //     // !!! add bond to atom
        //     return;
        // }

        if (this.mode === MouseMode.bondPressed) {
            // !!! change bond type
            return;
        }

        if (this.context.startAtom === undefined) {
            // !!! error
            return;
        }

        const distance = mouseCurrentLocation.distance(mouseDownLocation);
        // console.log("distance=", distance);

        const BondVector = new Vector2(1, 0).scaleSelf(EditorConstants.Scale);

        if (distance > ToolsConstants.ValidMouseMoveDistance) {
            BondVector.rotateRadSelf(mouseCurrentLocation.angle(mouseDownLocation));
        }

        const endAtomCenter = this.context.startAtom?.getCenter().addNew(BondVector);

        if (this.context.endAtom === undefined) {
            this.context.endAtom = new Atom({ props: { symbol: "C", center: endAtomCenter } } as IAtom);
            this.context.startAtom.draw();
            this.context.endAtom.draw();
        } else {
            this.context.endAtom.updateAttributes({ center: endAtomCenter });
        }

        this.context.bond = this.context.bond ?? this.createBond();

        this.context.bond.movedByAtomId(this.context.endAtom.getId());
    }

    crDeg = 0;

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        const { getAtomById, atomAtPoint, bondAtPoint } = EntitiesMapsStorage;
        const { mouseDownLocation, mouseCurrentLocation } = eventHolder;

        if (this.mode === MouseMode.Default) {
            // !!! ??? what to do
            return;
        }

        if (this.mode === MouseMode.atomPressed) {
            // !!! ??? nothing special to do?
            // return;
        }

        if (this.mode === MouseMode.bondPressed) {
            return;
        }

        if (this.mode === MouseMode.EmptyPress && this.context.endAtom) {
            // !!! ??? all is draw - just need to send action?
            return;
        }

        if (this.context.endAtom === undefined) {
            const BondVector = new Vector2(1, 0).scaleNew(EditorConstants.Scale);

            if (this.context.rotation) {
                const kekuleAtom = this.context.startAtom?.getKekuleNode();
                const currentRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, this.bondOrder);

                // const dSingleResultRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, BondOrder.Single);
                // const dDoubleResultRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, BondOrder.Double);
                // const dTripleResultRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, BondOrder.Triple);
                // const dWedgeFrontResultRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, BondOrder.WedgeFront);
                // const dWedgeBackResultRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, BondOrder.WedgeBack);

                // const dSingleResultDeg = (dSingleResultRad * 180) / Math.PI;
                // const dDoubleResultDeg = (dDoubleResultRad * 180) / Math.PI;
                // const dTripleResultDeg = (dTripleResultRad * 180) / Math.PI;
                // const dWedgeFrontResultDeg = (dWedgeFrontResultRad * 180) / Math.PI;
                // const dWedgeBackResultDeg = (dWedgeBackResultRad * 180) / Math.PI;

                // BondVector.rotateSelf(this.context.rotation);
                // BondVector.rotateSelf(-(this.crDeg * Math.PI) / 180);
                const rotation = KekuleUtils.calcPreferred2DBondGrowingDirection(kekuleAtom, currentRad, true);
                const currentDeg = (rotation * 180) / Math.PI;

                // BondVector.rotateRadSelf(rotation);
                BondVector.rotateRadSelf(-rotation);
                this.crDeg += 30;
            } else {
                BondVector.rotateRadSelf(this.bondOrder === BondOrder.Single ? -(Math.PI / 6) : 0);
            }

            const endAtomCenter = this.context.startAtom?.getCenter().addNew(BondVector);

            this.context.endAtom = new Atom({ props: { symbol: "C", center: endAtomCenter } } as IAtom);
            this.context.startAtom!.draw();
            this.context.endAtom.draw();
        }

        this.context.bond = this.context.bond ?? this.createBond();
        this.context.bond.movedByAtomId(this.context.endAtom.getId());
        this.context = {};
    }

    createBond() {
        const bondArgs = {
            props: {
                order: this.bondOrder,
                stereo: this.bondStereo,
                atomStartId: this.context.startAtom!.getId(),
                atomEndId: this.context.endAtom!.getId(),
            },
        } as IBond;

        const bond = new Bond(bondArgs);
        bond.draw();

        return bond;
    }
}

const singleBond = new BondToolBarItem("Bond Single", BondOrder.Single, BondStereoKekule.NONE, ["A"]);
const doubleBond = new BondToolBarItem("Bond Double", BondOrder.Double, BondStereoKekule.NONE, ["B"]);
const tripleBond = new BondToolBarItem("Bond Triple", BondOrder.Triple, BondStereoKekule.NONE, ["C"]);
const wedgeFrontBond = new BondToolBarItem("Bond Wedge Front", BondOrder.Single, BondStereoKekule.UP, ["D"]);
const wedgeBackBond = new BondToolBarItem("Bond Wedge Back", BondOrder.Single, BondStereoKekule.DOWN, ["D"]);

export { doubleBond, singleBond, tripleBond, wedgeBackBond, wedgeFrontBond };
