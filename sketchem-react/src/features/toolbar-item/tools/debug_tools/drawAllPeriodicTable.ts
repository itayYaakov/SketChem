/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ElementsData } from "@constants/elements.constants";
import * as ToolsConstants from "@constants/tools.constants";
import { Atom } from "@entities";
import { RegisterToolbarButtonWithName } from "@features/toolbar-item/ToolsButtonMapper.helper";
import { IAtom } from "@src/types";
import Vector2 from "@src/utils/mathsTs/Vector2";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../../ToolbarItem";
import { RegisterToolbarWithName } from "../ToolsMapper.helper";

class DrawAllPeriodicTable implements ActiveToolbarItem {
    onActivate() {
        // const { editor } = attrs;
        // if (!editor) {
        //     throw new Error("SelectTemplate.onActivate: missing attributes or editor");
        // }
        const padding = 80;
        const startX = 1000;
        const atomCenter = new Vector2(startX, 500);
        // for (let index = 1; index < 119; index += 1) {
        for (let index = 1; index < 112; index += 1) {
            const elem = ElementsData.elementsByAtomicNumberMap.get(index);
            if (!elem) throw new Error(`Element with atomic number ${index} not found`);
            if ((index - 1) % 14 === 0) {
                atomCenter.x = startX - padding;
                atomCenter.x = startX;
                atomCenter.y += padding;
            }

            atomCenter.addValuesSelf(padding, 0);

            const atom = new Atom({ props: { symbol: elem.symbol, center: atomCenter.get() } } as IAtom);
            atom.execOuterDrawCommand();
        }
    }
}

const drawAllPeriodic = new DrawAllPeriodicTable();

RegisterToolbarWithName(ToolsConstants.ToolsNames.DebugDrawAllPeriodic, drawAllPeriodic);

const DrawAllPeriodic = new SimpleToolbarItemButtonBuilder(
    "draw all periodic (debug) ",
    ToolsConstants.ToolsNames.DebugDrawAllPeriodic
);

RegisterToolbarButtonWithName(DrawAllPeriodic);

export { DrawAllPeriodic };
