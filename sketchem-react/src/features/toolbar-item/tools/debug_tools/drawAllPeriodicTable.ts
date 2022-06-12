/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomConstants } from "@constants/atom.constants";
import { ElementsData } from "@constants/elements.constants";
import { EntityType, LayersNames } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import { Atom, Bond } from "@entities";
import type { NamedPoint, PointRBush } from "@features/shared/storage";
import { EntitiesMapsStorage } from "@features/shared/storage";
import { RegisterToolbarButtonWithName } from "@features/toolbar-item/ToolsButtonMapper.helper";
import { IAtom, MouseEventCallBackProperties } from "@src/types";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@src/utils/mathsTs/Vector2";
import { Circle } from "@svgdotjs/svg.js";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../../ToolbarItem";
import { RegisterToolbarWithName } from "../ToolsMapper.helper";

const { atomsTree, atomsMap, bondsTree, bondsMap } = EntitiesMapsStorage;

class DrawAllPeriodicTable implements ActiveToolbarItem {
    onActivate() {
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

            const atom = new Atom({ props: { symbol: elem.symbol, center: atomCenter } } as IAtom);
            atom.getOuterDrawCommand();
        }
    }
}

const drawAllPeriodic = new DrawAllPeriodicTable();

RegisterToolbarWithName(ToolsConstants.ToolsNames.DebugDrawAllPeriodic, drawAllPeriodic);

const DrawAllPeriodic = new SimpleToolbarItemButtonBuilder(
    "draw all periodic (debug) ",
    ToolsConstants.ToolsNames.DebugDrawAllPeriodic,
    ["A"]
);

RegisterToolbarButtonWithName(DrawAllPeriodic);

export { DrawAllPeriodic };
