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

    context!: {
        startAtom?: Atom;
        endAtom?: Atom;
        bond?: Bond;
        rotation?: number;
    };

    onActivate?(params: any): void;

    onMouseDown?(e: MouseEventCallBackProperties): MouseEventCallBackResponse | void;

    onMouseMove?(e: MouseEventCallBackProperties): MouseEventCallBackResponse | void;

    onMouseUp?(e: MouseEventCallBackProperties): MouseEventCallBackResponse | void;

    onMouseClick?(e: MouseEventCallBackProperties): MouseEventCallBackResponse | void;

    onMouseLeave?(e: MouseEventCallBackProperties): MouseEventCallBackResponse | void;

    onDeactivate?(): void;

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

    createAtom(center: Vector2, symbol: string) {
        const atomArgs = {
            props: {
                center,
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
        bond.draw();

        return bond;
    }

    moveBondAndCreateIfNeeded() {
        if (!this.context.endAtom) return;
        this.context.bond = this.context.bond ?? this.createBond();
        this.context.bond.movedByAtomId(this.context.endAtom.getId());
    }
}
