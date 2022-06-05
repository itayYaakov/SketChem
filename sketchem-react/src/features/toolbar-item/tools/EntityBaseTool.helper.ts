import { EditorConstants } from "@constants/editor.constant";
import { BondOrder, BondStereoKekule, LayersNames, MouseMode } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { EntitiesMapsStorage } from "@features/shared/storage";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { BondAttributes, IAtom, IBond, MouseEventCallBackProperties, MouseEventCallBackResponse } from "@types";

import { ActiveToolbarItem, ToolbarItemButton } from "../ToolbarItem";

export abstract class EntityBaseTool implements ActiveToolbarItem {
    bondOrder!: BondOrder;

    bondStereo!: BondStereoKekule;

    mode!: MouseMode;

    symbol!: string;

    dragged = false;

    context!: {
        startAtom?: Atom;
        endAtom?: Atom;
        bond?: Bond;
        rotation?: number;
    };

    onActivate?(params: any): void;

    onMouseDown?(e: MouseEventCallBackProperties): MouseEventCallBackResponse | void;

    onMouseUp?(e: MouseEventCallBackProperties): MouseEventCallBackResponse | void;

    onMouseClick?(e: MouseEventCallBackProperties): MouseEventCallBackResponse | void;

    onMouseLeave?(e: MouseEventCallBackProperties): MouseEventCallBackResponse | void;

    onDeactivate?(): void;

    atomWasPressed(point: Vector2) {
        const { getAtomById, atomAtPoint } = EntitiesMapsStorage;

        const atomWasPressed = atomAtPoint(point);
        if (atomWasPressed) {
            this.mode = MouseMode.AtomPressed;
            const atom = getAtomById(atomWasPressed.id);
            this.context.startAtom = atom;
            return true;
        }
        return false;
    }

    bondWasPressed(point: Vector2) {
        const { getBondById, bondAtPoint } = EntitiesMapsStorage;

        const bondWasPressed = bondAtPoint(point);
        if (bondWasPressed) {
            this.mode = MouseMode.BondPressed;
            const bond = getBondById(bondWasPressed.id);
            const pressedBondAttributes = bond.getAttributes();
            const pressedBondNoneStereo = pressedBondAttributes.stereo === BondStereoKekule.NONE;
            const thisBondOrderSingle = this.bondOrder === BondOrder.Single;
            if (thisBondOrderSingle && this.bondStereo === BondStereoKekule.NONE && pressedBondNoneStereo) {
                let newBondOrder;
                switch (pressedBondAttributes.order) {
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
                        return true;
                }
                bond.updateAttributes({ order: newBondOrder });
                return true;
            }
            if (
                this.bondStereo === pressedBondAttributes.stereo &&
                this.bondOrder === pressedBondAttributes.order &&
                this.bondOrder === BondOrder.Single &&
                (this.bondStereo === BondStereoKekule.DOWN || this.bondStereo === BondStereoKekule.UP)
            ) {
                bond.updateAttributes({
                    atomStartId: pressedBondAttributes.atomEndId,
                    atomEndId: pressedBondAttributes.atomStartId,
                });
                return true;
            }

            const newAttributes: Partial<BondAttributes> = {};
            if (pressedBondAttributes.order !== this.bondOrder) newAttributes.order = this.bondOrder;
            if (pressedBondAttributes.stereo !== this.bondStereo) newAttributes.stereo = this.bondStereo;
            if (newAttributes) bond.updateAttributes(newAttributes);
            return true;
        }
        return false;
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation, mouseCurrentLocation } = eventHolder;

        if (this.mode !== MouseMode.AtomPressed && this.mode !== MouseMode.EmptyPress) return;

        const distance = mouseCurrentLocation.distance(mouseDownLocation);

        if (distance < ToolsConstants.ValidMouseMoveDistance) {
            const ignoreAtomRemove = [this.context.endAtom?.getId() ?? -1];
            this.context.endAtom?.destroy([], false);
            this.context.endAtom = undefined;

            if (this.mode === MouseMode.EmptyPress) {
                ignoreAtomRemove.push(this.context.startAtom?.getId() ?? -1);
                this.context.startAtom?.destroy([], false);
                this.context.startAtom = undefined;
            } else if (this.mode === MouseMode.AtomPressed) {
                ignoreAtomRemove.push(this.context.startAtom?.getId() ?? -1);
            }

            this.context.bond?.destroy(ignoreAtomRemove);
            this.context.bond = undefined;
            this.context.startAtom?.getOuterDrawCommand();
            return;
        }

        if (!this.context.startAtom) {
            this.context.startAtom = this.createAtom(mouseDownLocation);
            if (!this.context.startAtom) {
                return;
            }
        }
        this.context.startAtom.getOuterDrawCommand();

        // specify that at some point the atom was dragged
        this.dragged = true;

        const rotation = -mouseCurrentLocation.angle(mouseDownLocation);
        const endAtomCenter = this.calculatePosition(this.context.startAtom, rotation);

        if (this.context.endAtom === undefined) {
            this.context.endAtom = this.createAtom(endAtomCenter);
            this.context.endAtom.getOuterDrawCommand();
        } else {
            this.context.endAtom.updateAttributes({ center: endAtomCenter });
        }

        this.moveBondAndCreateIfNeeded();
    }

    calculateOptimalAngle(atom: Atom) {
        const kekuleAtom = atom.getKekuleNode();
        const currentRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, this.bondOrder);

        const rotation = KekuleUtils.calcPreferred2DBondGrowingDirection(kekuleAtom, currentRad, true);
        return rotation;
    }

    calculatePosition(baseAtom: Atom, rotation?: number) {
        const BondVector = new Vector2(1, 0).scaleSelf(EditorConstants.Scale);

        const vectorRotation = rotation ?? this.calculateOptimalAngle(baseAtom);
        // const currentDeg = (rotation * 180) / Math.PI;

        BondVector.rotateRadSelf(-vectorRotation);

        const endAtomCenter = baseAtom.getCenter().addNew(BondVector);
        return endAtomCenter;
    }

    createAtom(center: Vector2) {
        const { symbol } = this;
        const atomArgs = {
            props: {
                center,
                symbol,
            },
        } as IAtom;

        const atom = new Atom(atomArgs);
        // atom.getOuterDrawCommand();

        return atom;
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

    moveBondAndCreateIfNeeded() {
        if (!this.context.endAtom) return;
        this.context.bond = this.context.bond ?? this.createBond();
        this.context.bond.movedByAtomId(this.context.endAtom.getId());
    }
}
