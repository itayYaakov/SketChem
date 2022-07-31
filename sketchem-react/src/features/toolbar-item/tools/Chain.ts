import { EditorConstants } from "@constants/editor.constant";
import { BondOrder, BondStereoKekule, EntityVisualState, LayersNames, MouseMode } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Path, PathArray, Text } from "@svgdotjs/svg.js";
import { IAtom, IBond, MouseEventCallBackProperties } from "@types";
import { AngleUtils } from "@utils/AngleUtils";

import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { BondTool, BondToolButton } from "./BondTool";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

const toolColor = "#e65100";

export interface IAtomMergeAction {
    replacingAtomIndex: number;
    replacedAtom: Atom;
}

class ChainToolBar extends BondTool {
    chainAddedBonds: Bond[] = [];

    chainAddedAtoms: Atom[] = [];

    temporaryPathArray?: PathArray;

    finalAtomsCenters: Vector2[] = [];

    temporaryPath?: Path;

    sectorsIndicator?: Text;

    symbol: string = "C";

    mergeAtomsByIndex!: (Atom | undefined)[];

    resetMergedAtoms() {
        this.mergeAtomsByIndex?.forEach((atom) => {
            atom?.setVisualState(EntityVisualState.None);
        });
        this.mergeAtomsByIndex = [];
    }

    override onMouseDown(eventHolder: MouseEventCallBackProperties) {
        this.chainAddedAtoms = [];
        this.chainAddedBonds = [];
        this.resetMergedAtoms();
        this.initialAngle = 0;
        this.temporaryPath?.remove();
        this.temporaryPath = undefined;
        this.sectorsIndicator?.remove();
        this.sectorsIndicator = undefined;
        this.finalAtomsCenters = [];
        super.onMouseDown(eventHolder);
        if (this.context.startAtom !== undefined && this.context.startAtomIsPredefined === false) {
            this.context.startAtom.execOuterDrawCommand();
        }
    }

    initialAngle!: number;

    onMouseMove(eventHolder: MouseEventCallBackProperties) {
        const { mouseDownLocation, mouseCurrentLocation, editor } = eventHolder;
        editor.setHoverMode(false, true, true);
        this.sectorsIndicator?.remove();
        this.sectorsIndicator = undefined;

        if (this.mode === MouseMode.Default) {
            // !!! add hover
            return;
        }

        if (this.mode === MouseMode.BondPressed) {
            return;
        }

        if (this.context.startAtom === undefined) {
            return;
        }

        const distance = mouseCurrentLocation.distance(mouseDownLocation);

        if (distance < ToolsConstants.ValidMouseMoveDistance) {
            return;
        }

        const BondVectorLength = EditorConstants.Scale;

        const chainLength = Math.floor(distance / BondVectorLength);

        let lastAtomCenter = this.context.startAtom.getCenter();
        this.temporaryPathArray = new PathArray([["M", lastAtomCenter.x, lastAtomCenter.y]]);
        this.finalAtomsCenters = [lastAtomCenter];

        this.temporaryPath =
            this.temporaryPath ??
            LayersUtils.getLayer(LayersNames.Bond).path(this.temporaryPathArray).fill("none").stroke({
                color: toolColor,
                width: 3,
                opacity: 0.7,
                dasharray: "0.4em",
                linecap: "round",
                linejoin: "round",
            });

        this.resetMergedAtoms();
        let angle = mouseCurrentLocation.angle(mouseDownLocation);
        angle = AngleUtils.limitInSteps(angle, (1 / 12) * Math.PI);
        angle = AngleUtils.clampPosAngleRad(angle);
        this.initialAngle = angle + (1 / 6) * Math.PI;

        for (let index = 1; index < chainLength + 1; index += 1) {
            let rotation;

            if (index % 2 === 1) {
                rotation = this.initialAngle;
            } else {
                rotation = this.initialAngle - (1 / 3) * Math.PI;
            }

            rotation = AngleUtils.clampPosAngleRad(rotation);
            const BondVector = new Vector2(1, 0).scaleSelf(EditorConstants.Scale).rotateRadSelf(rotation);
            const endAtomCenter = lastAtomCenter.addNew(BondVector);

            this.checkForPossibleNodeMerge(endAtomCenter, index, [this.context.startAtom.getId()]);

            this.finalAtomsCenters.push(endAtomCenter);
            this.temporaryPathArray.push(["L", endAtomCenter.x, endAtomCenter.y]);
            lastAtomCenter = endAtomCenter;
        }

        this.temporaryPath.plot(this.temporaryPathArray);

        if (this.finalAtomsCenters.length > 1) {
            this.sectorsIndicator =
                this.sectorsIndicator ??
                LayersUtils.getLayer(LayersNames.General).text("").attr({ "pointer-events": "none" }).fill(toolColor);

            const lastPointCenter = this.finalAtomsCenters[this.finalAtomsCenters.length - 1];
            const PreviousPointCenter = this.finalAtomsCenters[this.finalAtomsCenters.length - 2];
            const direction = lastPointCenter.subNew(PreviousPointCenter).scaleSelf(0.3);
            const sectorIndicatorPosition = lastPointCenter.addNew(direction);

            this.sectorsIndicator
                .text(chainLength.toString())
                .center(sectorIndicatorPosition.x, sectorIndicatorPosition.y);
        }
    }

    private checkForPossibleNodeMerge(point: Vector2, index: number, ignoreAtomList: number[]) {
        const { getAtomById, atomAtPoint } = EntitiesMapsStorage;

        const replacedAtomNode = atomAtPoint(point, ignoreAtomList);
        if (replacedAtomNode) {
            const replacedAtom = getAtomById(replacedAtomNode.id);
            replacedAtom.setVisualState(EntityVisualState.Merge);
            this.mergeAtomsByIndex[index] = replacedAtom;
            return true;
        }
        this.mergeAtomsByIndex[index] = undefined;
        return false;
    }

    private createChain() {
        let previousAtom = this.context.startAtom;
        if (!previousAtom) {
            throw new Error("startAtom should be undefined");
        }

        const ignoreAtomList = [previousAtom.getId()];

        for (let index = 1; index < this.finalAtomsCenters.length; index += 1) {
            const endAtomCenter = this.finalAtomsCenters[index];
            const chainAtom = new Atom({ props: { symbol: this.symbol, center: endAtomCenter.get() } } as IAtom);
            ignoreAtomList.push(chainAtom.getId());

            this.chainAddedAtoms.push(chainAtom);
            chainAtom.execOuterDrawCommand();

            const bondArgs = {
                props: {
                    order: this.bondOrder,
                    stereo: this.bondStereo,
                    atomStartId: previousAtom.getId(),
                    atomEndId: chainAtom.getId(),
                },
            } as IBond;

            const bond = new Bond(bondArgs);
            bond.execOuterDrawCommand();

            const possibleMergedAtom = this.mergeAtomsByIndex[index];
            if (possibleMergedAtom !== undefined) {
                chainAtom.mergeWith(possibleMergedAtom);
            }

            this.chainAddedBonds.push(bond);
            previousAtom = chainAtom;
        }
    }

    onMouseLeave(eventHolder: MouseEventCallBackProperties) {
        this.doCancel(eventHolder);
    }

    onMouseUp(eventHolder: MouseEventCallBackProperties) {
        this.doCancel(eventHolder);
    }

    doCancel(eventHolder: MouseEventCallBackProperties) {
        const { editor } = eventHolder;
        this.createChain();
        this.cancel();
        editor.setHoverMode(true, true, true);
        this.createHistoryUpdate(eventHolder);
    }

    cancel() {
        this.temporaryPath?.remove();
        this.temporaryPath = undefined;
        this.sectorsIndicator?.remove();
        this.sectorsIndicator = undefined;
        this.finalAtomsCenters = [];
        this.resetMergedAtoms();
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
    keyboardKeys: ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.ToolsNames.Chain),
};

RegisterToolbarButtonWithName(Chain);

export default Chain;
