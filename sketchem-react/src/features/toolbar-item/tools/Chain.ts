import { EditorConstants } from "@constants/editor.constant";
import { BondOrder, BondStereoKekule, LayersNames, MouseMode } from "@constants/enum.constants";
import { ToolsConstants } from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { EntitiesMapsStorage } from "@features/shared/storage";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { BondAttributes, IAtom, IBond, MouseEventCallBackProperties } from "@types";
import { AngleUtils } from "@utils/AngleUtils";

import { ActiveToolbarItem } from "../ToolbarItem";
import { BondTool, BondToolButton } from "./BondTool";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

class ChainToolBar extends BondTool {
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

        if (this.mode === MouseMode.BondPressed) {
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

        let angle = mouseCurrentLocation.angle(mouseDownLocation);
        angle = AngleUtils.limitInSteps(angle, (1 / 12) * Math.PI);
        angle = AngleUtils.clampPosAngleRad(angle);
        // angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        //     // this.initialAngle = angle;
        this.initialAngle = angle + (1 / 6) * Math.PI;

        console.log(
            "angle=",
            (AngleUtils.clampPosAngleRad(mouseCurrentLocation.angle(mouseDownLocation)) / Math.PI) * 180,
            "angle clamped =",
            (angle / Math.PI) * 180,
            "initialAngle=",
            (this.initialAngle / Math.PI) * 180
        );

        for (let index = 0; index < chainLength; index += 1) {
            let chainAtom = this.chainAddedAtoms[index];

            let rotation;
            if (index % 2 === 1) {
                rotation = this.initialAngle - (1 / 3) * Math.PI;
            } else {
                rotation = this.initialAngle;
            }
            rotation = AngleUtils.clampPosAngleRad(rotation);
            const BondVector = new Vector2(1, 0).scaleSelf(EditorConstants.Scale).rotateRadSelf(rotation);
            endAtomCenter = lastAtom.getCenter().addNew(BondVector);

            if (chainAtom === undefined) {
                chainAtom = new Atom({ props: { symbol: "C", center: endAtomCenter } } as IAtom);

                console.log("Added atom", index, "sectors=", chainLength, this.chainAddedAtoms);
                this.chainAddedAtoms.push(chainAtom);
                console.log(index, "Added bond", index, "sectors=", chainLength, this.chainAddedAtoms);

                this.context.startAtom.getOuterDrawCommand();
                chainAtom.getOuterDrawCommand();

                const bondArgs = {
                    props: {
                        order: this.bondOrder,
                        stereo: this.bondStereo,
                        atomStartId: lastAtom.getId(),
                        atomEndId: chainAtom.getId(),
                    },
                } as IBond;

                const bond = new Bond(bondArgs);
                console.log(`${index}: Added bond ${bond.getId()} Added atom ${chainAtom.getId()}`);
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

        for (let index = chainLength; index < this.chainAddedBonds.length; index += 1) {
            const chainRemovedBond = this.chainAddedBonds[index];
            if (chainRemovedBond !== undefined) {
                console.log(`${index}: Remove bond ${chainRemovedBond.getId()}`);
                if (index === 0) {
                    chainRemovedBond.destroy([this.context.startAtom.getId()]);
                } else {
                    chainRemovedBond.destroy();
                }
            }
        }
        console.log("Atoms length", this.chainAddedAtoms.length, "Bonds length", this.chainAddedBonds.length);
        this.chainAddedAtoms = this.chainAddedAtoms.slice(0, chainLength);
        this.chainAddedBonds = this.chainAddedBonds.slice(0, chainLength);
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {}

    cancel() {
        this.context = {};
    }
}

const chain = new ChainToolBar();

RegisterToolbarWithName(ToolsConstants.ToolsNames.Chain, chain);

const Chain: BondToolButton = {
    name: "Chain",
    toolName: ToolsConstants.ToolsNames.Chain,
    attributes: {
        bondOrder: BondOrder.Single,
        bondStereo: BondStereoKekule.NONE,
    },
    keyboardKeys: ["A"],
};

export default Chain;
