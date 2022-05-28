import { EditorConstants } from "@constants/editor.constant";
import { BondOrder, BondStereoKekule, LayersNames, MouseMode } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { EntitiesMapsStorage } from "@features/shared/storage";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { BondAttributes, IAtom, IBond, MouseEventCallBackProperties } from "@types";

import { ActiveToolbarItem } from "../ToolbarItem";
import { BondToolBarItem } from "./bondToolBarItems";

class ChainToolBar extends BondToolBarItem {
    chainAddedBonds: Bond[] = [];

    chainAddedAtoms: Atom[] = [];

    override onMouseDown(eventHolder: MouseEventCallBackProperties) {
        this.chainAddedAtoms = [];
        this.chainAddedBonds = [];
        this.initialAngle = 0;
        super.onMouseDown(eventHolder);
    }

    initialAngle!: number;

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation, mouseCurrentLocation } = eventHolder;

        if (this.mode === MouseMode.Default) {
            // !!! add hover
            return;
        }

        if (this.mode === MouseMode.bondPressed) {
            // !!! change bond type
            return;
        }

        if (this.context.startAtom === undefined) {
            // !!! error
            return;
        }

        const distance = mouseCurrentLocation.distance(mouseDownLocation);

        if (distance < ToolsConstants.ValidMouseMoveDistance) {
            // !!! need to delete unused bonds
            // this.cancel();
            return;
        }

        const BondVectorLength = EditorConstants.Scale;

        const chainLength = Math.floor(distance / BondVectorLength);

        let lastAtom = this.context.startAtom;
        let endAtomCenter;

        const angle = mouseCurrentLocation.angle(mouseDownLocation);
        //     // this.initialAngle = angle;
        this.initialAngle = angle + (1 / 6) * Math.PI;
        // clamp angle in steps of 15 degrees
        this.initialAngle -= this.initialAngle % ((1 / 12) * Math.PI);
        // console.log("angle=", (angle / Math.PI) * 180, "initialAngle=", (this.initialAngle / Math.PI) * 180);
        // }

        for (let index = 0; index < chainLength; index += 1) {
            let chainAtom = this.chainAddedAtoms[index];

            let rotation;
            if (index % 2 === 1) {
                rotation = this.initialAngle - (1 / 3) * Math.PI;
            } else {
                rotation = this.initialAngle;
            }
            const BondVector = new Vector2(1, 0).scaleSelf(EditorConstants.Scale).rotateRadSelf(rotation);
            endAtomCenter = lastAtom.getCenter().addNew(BondVector);

            if (chainAtom === undefined) {
                chainAtom = new Atom({ props: { symbol: "C", center: endAtomCenter } } as IAtom);

                this.chainAddedAtoms.push(chainAtom);
                // console.log("Added bond", index, "sectors=", chainLength, this.chainAddedAtoms);

                this.context.startAtom.draw();
                chainAtom.draw();

                const bondArgs = {
                    props: {
                        order: this.bondOrder,
                        stereo: this.bondStereo,
                        atomStartId: lastAtom.getId(),
                        atomEndId: chainAtom.getId(),
                    },
                } as IBond;

                const bond = new Bond(bondArgs);
                bond.draw();

                // console.log(
                //     "Index=",
                //     index,
                //     "Atom id",
                //     chainAtom.getId(),
                //     "Bond id",
                //     bond.getId(),
                //     "rotation:",
                //     (rotation / Math.PI) * 180
                // );

                this.chainAddedBonds.push(bond);
            } else {
                chainAtom.updateAttributes({ center: endAtomCenter });
            }
            lastAtom = chainAtom;
        }

        for (let index = chainLength; index < this.chainAddedAtoms.length; index += 1) {
            console.log("Removed atom", index);
            const chainRemovedAtom = this.chainAddedAtoms[index];
            if (chainRemovedAtom !== undefined) {
                chainRemovedAtom.destroy();
            }
        }
        this.chainAddedAtoms = this.chainAddedAtoms.slice(0, chainLength);
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        // const { getAtomById, atomAtPoint, bondAtPoint } = EntitiesMapsStorage;
        // const { mouseDownLocation, mouseCurrentLocation } = eventHolder;
        // if (this.mode === MouseMode.Default) {
        //     // !!! ??? what to do
        //     return;
        // }
        // if (this.mode === MouseMode.atomPressed) {
        //     // !!! ??? what to do
        //     // return;
        // }
        // if (this.mode === MouseMode.bondPressed) {
        //     // !!! ??? what to do
        // }
        // if (this.mode === MouseMode.EmptyPress && this.context.endAtom) {
        //     // !!! ??? all is draw - just need to send action?
        //     return;
        // }
        // if (this.context.endAtom === undefined) {
        //     const BondVector = new Vector2(1, 0).scaleNew(EditorConstants.Scale);
        //     if (this.context.rotation) {
        //         const kekuleAtom = this.context.startAtom?.getKekuleNode();
        //         const currentRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, this.bondOrder);
        //         // const dSingleResultRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, BondOrder.Single);
        //         // const dDoubleResultRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, BondOrder.Double);
        //         // const dTripleResultRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, BondOrder.Triple);
        //         // const dWedgeFrontResultRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, BondOrder.WedgeFront);
        //         // const dWedgeBackResultRad = KekuleUtils.getNewBondDefAngle(kekuleAtom, BondOrder.WedgeBack);
        //         // const dSingleResultDeg = (dSingleResultRad * 180) / Math.PI;
        //         // const dDoubleResultDeg = (dDoubleResultRad * 180) / Math.PI;
        //         // const dTripleResultDeg = (dTripleResultRad * 180) / Math.PI;
        //         // const dWedgeFrontResultDeg = (dWedgeFrontResultRad * 180) / Math.PI;
        //         // const dWedgeBackResultDeg = (dWedgeBackResultRad * 180) / Math.PI;
        //         // BondVector.rotateSelf(this.context.rotation);
        //         // BondVector.rotateSelf(-(this.crDeg * Math.PI) / 180);
        //         const rotation = KekuleUtils.calcPreferred2DBondGrowingDirection(kekuleAtom, currentRad, true);
        //         const currentDeg = (rotation * 180) / Math.PI;
        //         // BondVector.rotateRadSelf(rotation);
        //         BondVector.rotateRadSelf(-rotation);
        //     } else {
        //         BondVector.rotateRadSelf(this.bondOrder === BondOrder.Single ? -(Math.PI / 6) : 0);
        //     }
        //     const endAtomCenter = this.context.startAtom?.getCenter().addNew(BondVector);
        //     this.context.endAtom = new Atom({ props: { symbol: "C", center: endAtomCenter } } as IAtom);
        //     this.context.startAtom!.draw();
        //     this.context.endAtom.draw();
        // }
        // this.context.bond = this.context.bond ?? this.createBond();
        // this.context.bond.movedByAtomId(this.context.endAtom.getId());
        // this.context = {};
    }

    cancel() {
        this.context = {};
    }
}

const Chain = new ChainToolBar("Chain", BondOrder.Single, BondStereoKekule.NONE, ["A"]);
export default Chain;
