import { EditorConstants } from "@constants/editor.constant";
import { BondOrder, BondStereoKekule, EntityVisualState, MouseMode } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { EditorHandler } from "@features/editor/EditorHandler";
import { EntitiesMapsStorage } from "@features/shared/storage";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { BondAttributes, IAtom, IBond, MouseEventCallBackProperties } from "@types";

import { ActiveToolbarItem, LaunchAttrs } from "../ToolbarItem";

export abstract class EntityBaseTool implements ActiveToolbarItem {
    bondOrder!: BondOrder;

    bondStereo!: BondStereoKekule;

    mode!: MouseMode;

    symbol!: string;

    context!: {
        startAtom?: Atom;
        startAtomIsPredefined?: boolean;
        endAtom?: Atom;
        endAtomIsPredefined?: boolean;
        bond?: Bond;
        rotation?: number;
        dragged?: boolean;
    };

    onActivate?(attrs?: LaunchAttrs): void;

    onMouseDown?(e: MouseEventCallBackProperties): void;

    onMouseUp?(e: MouseEventCallBackProperties): void;

    onMouseClick?(e: MouseEventCallBackProperties): void;

    onMouseLeave?(e: MouseEventCallBackProperties): void;

    onDeactivate?(): void;

    createHistoryUpdate(e: MouseEventCallBackProperties) {
        const { editor } = e;
        editor.createHistoryUpdate();
    }

    protected changeSelectionBonds(editor: EditorHandler) {
        // create a function that accept a bond and update it's attributes with current tool attributes
        const updateBondAttributes = (bond: Bond) => {
            bond.updateAttributes({
                order: this.bondOrder,
                stereo: this.bondStereo,
            });
        };

        const changed = editor.applyFunctionToBonds(updateBondAttributes, true);
        editor.resetSelectedAtoms();
        editor.resetSelectedBonds();
        if (changed) editor.createHistoryUpdate();
    }

    atomWasPressed(point: Vector2, eventHolder: MouseEventCallBackProperties) {
        const atom = eventHolder.editor.getHoveredAtom();
        if (atom) {
            this.mode = MouseMode.AtomPressed;
            this.context.startAtom = atom;
            this.context.startAtomIsPredefined = true;
            return true;
        }
        return false;
    }

    createIgnoreAtomList(whichOne: "start" | "end" | "both" = "both") {
        const ignoreAtomRemove = [];
        if (this.context.startAtom && whichOne !== "end") {
            ignoreAtomRemove.push(this.context.startAtom.getId());
        }
        if (this.context.endAtom && whichOne !== "start") {
            ignoreAtomRemove.push(this.context.endAtom.getId());
        }
        if (ignoreAtomRemove.length === 0) return undefined;
        return ignoreAtomRemove;
    }

    private destroyAtomsCreatedByMe(whichOne: "start" | "end" | "both" = "both") {
        const ignoreAtomRemove = [];

        if (this.context.startAtom && whichOne !== "end") {
            ignoreAtomRemove.push(this.context.startAtom.getId());
            if (this.context.startAtomIsPredefined === false) {
                this.context.startAtom.destroy([], false);
                this.context.startAtom = undefined;
            }
        }

        if (this.context.endAtom && whichOne !== "start") {
            ignoreAtomRemove.push(this.context.endAtom.getId());
            if (this.context.endAtomIsPredefined === false) {
                this.context.endAtom.destroy([], false);
                this.context.endAtom = undefined;
            }
        }
        return ignoreAtomRemove;
    }

    mouseMovedToAnExistingAtom(point: Vector2) {
        const { getAtomById, atomAtPoint } = EntitiesMapsStorage;

        let ignoreAtomList;
        if (this.context.endAtomIsPredefined === true) {
            // console.log("ignoreAtomList = this.createIgnoreAtomList(start);");
            ignoreAtomList = this.createIgnoreAtomList("start");
        } else {
            // console.log("ignoreAtomList = this.createIgnoreAtomList(both);");
            ignoreAtomList = this.createIgnoreAtomList("both");
        }

        const draggedToAtom = atomAtPoint(point, ignoreAtomList);
        if (draggedToAtom) {
            // destroy previous atom if it exists
            this.destroyAtomsCreatedByMe("end");

            this.mode = MouseMode.AtomPressed;
            const atom = getAtomById(draggedToAtom.id);
            this.context.endAtom = atom;
            this.context.endAtomIsPredefined = true;
            // console.log("found atom");
            return true;
        }
        // console.log("Couldn't find atom");
        return false;
    }

    bondWasPressed(point: Vector2, eventHolder: MouseEventCallBackProperties) {
        const bond = eventHolder.editor.getHoveredBond();
        if (bond) {
            this.mode = MouseMode.BondPressed;
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
                    case BondOrder.SingleOrDouble:
                        newBondOrder = BondOrder.Single;
                        break;
                    default:
                        return true;
                }
                bond.setVisualState(EntityVisualState.AnimatedClick);
                bond.updateAttributes({ order: newBondOrder });
                return true;
            }
            if (
                this.bondStereo === pressedBondAttributes.stereo &&
                this.bondOrder === pressedBondAttributes.order &&
                this.bondOrder === BondOrder.Single &&
                (this.bondStereo === BondStereoKekule.DOWN || this.bondStereo === BondStereoKekule.UP)
            ) {
                bond.setVisualState(EntityVisualState.AnimatedClick);
                bond.updateAttributes({
                    atomStartId: pressedBondAttributes.atomEndId,
                    atomEndId: pressedBondAttributes.atomStartId,
                });
                return true;
            }

            const newAttributes: Partial<BondAttributes> = {};
            if (pressedBondAttributes.order !== this.bondOrder) newAttributes.order = this.bondOrder;
            if (pressedBondAttributes.stereo !== this.bondStereo) newAttributes.stereo = this.bondStereo;
            if (newAttributes) {
                bond.setVisualState(EntityVisualState.AnimatedClick);
                bond.updateAttributes(newAttributes);
            }
            return true;
        }
        return false;
    }

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        if (!this.context) return;
        if (this.context.startAtom && this.context.startAtom.getLifeStage() > 2) {
            console.error("I'm dead 2");
        }

        // console.log(this.context);

        const { mouseDownLocation, mouseCurrentLocation, editor } = eventHolder;

        // console.log("A-4 Start Atom = ", this.context.startAtom);
        if (this.mode !== MouseMode.AtomPressed && this.mode !== MouseMode.EmptyPress) return;
        editor.setHoverMode(true, true, false);
        // console.log("A-3 Start Atom = ", this.context.startAtom);
        const distance = mouseCurrentLocation.distance(mouseDownLocation);
        // console.log("A-2 Start Atom = ", this.context.startAtom);

        if (distance < ToolsConstants.ValidMouseMoveDistance) {
            if (this.context.dragged === false) return;
            const ignoreAtomRemove = this.destroyAtomsCreatedByMe("both");

            // console.debug(`Bond ${this.context.bond?.getId()} was destroyed`);
            this.context.bond?.destroy(ignoreAtomRemove);
            this.context.bond = undefined;
            this.context.startAtom?.execOuterDrawCommand();
            // console.log("A-1 Start Atom = ", this.context.startAtom);
            return;
        }

        // console.log("A0 Start Atom = ", this.context.startAtom);
        if (!this.context.startAtom) {
            // console.log("A Start Atom = ", this.context.startAtom);
            this.context.startAtom = this.createAtom(mouseDownLocation);
            // console.log("B Start Atom = ", this.context.startAtom);
            this.context.startAtomIsPredefined = false;
            if (!this.context.startAtom) {
                // console.log("C Start Atom = ", this.context.startAtom);
                return;
            }
        }
        this.context.startAtom.execOuterDrawCommand();

        // specify that at some point the atom was dragged
        this.context.dragged = true;

        const rotation = -mouseCurrentLocation.angle(mouseDownLocation);
        const endAtomCenter = this.calculatePosition(this.context.startAtom, rotation);

        // if mouse is not moved to an existing atom and end atom is not created yet
        if (!this.mouseMovedToAnExistingAtom(mouseCurrentLocation)) {
            if (this.context.endAtom && this.context.endAtomIsPredefined !== true) {
                this.context.endAtom.updateAttributes({ center: endAtomCenter.get() });
            } else {
                this.context.endAtom?.execOuterDrawCommand();
                this.context.endAtom = this.createAtom(endAtomCenter);
                this.context.endAtomIsPredefined = false;
            }
            this.context.endAtom.execOuterDrawCommand();
        }
        // // if mouse is not moved to an existing atom and end atom is not created yet
        // if (!this.mouseMovedToAnExistingAtom(mouseCurrentLocation) && this.context.endAtom === undefined) {
        //     this.context.endAtom = this.createAtom(endAtomCenter);
        //     this.context.endAtomIsPredefined = false;
        //     this.context.endAtom.getOuterDrawCommand();
        // } else if (this.context.endAtom && this.context.endAtomIsPredefined === false) {
        //     this.context.endAtom.updateAttributes({ center: endAtomCenter });
        // } else if (this.context.endAtom === undefined) {
        //     console.error("end atom is undefined - shuoldn't be possible");
        // }

        // console.log(`B I'm moved and bond equals ${this.context?.bond?.getId()}`);
        this.createMoveAndHandleBond();
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
                center: center.get(),
                symbol,
            },
        } as IAtom;

        const atom = new Atom(atomArgs);

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
        bond.execOuterDrawCommand();

        return bond;
    }

    createMoveAndHandleBond() {
        if (!this.context.endAtom || !this.context.startAtom) return;
        if (!this.context.bond) {
            this.context.bond = this.createBond();
            return;
        }

        const bondAttributes: Partial<BondAttributes> = this.context.bond.getAttributes();
        const { atomStartId: currentBondStartAtomId, atomEndId: currentBondEndAtomId } = bondAttributes;

        delete bondAttributes.id;
        delete bondAttributes.order;
        delete bondAttributes.stereo;

        if (currentBondStartAtomId !== this.context.startAtom.getId()) {
            bondAttributes.atomStartId = this.context.startAtom.getId();
        } else {
            delete bondAttributes.atomStartId;
        }

        if (currentBondEndAtomId !== this.context.endAtom.getId()) {
            bondAttributes.atomEndId = this.context.endAtom.getId();
        } else {
            delete bondAttributes.atomEndId;
            // only move the bond if end atom id hasn't changed and it's not predefined
            if (this.context.endAtomIsPredefined === false) {
                this.context.bond.execOuterDrawCommand();
            }
        }

        if (Object.keys(bondAttributes).length > 0) {
            this.context.bond.updateAttributes(bondAttributes);
        }
    }
}
