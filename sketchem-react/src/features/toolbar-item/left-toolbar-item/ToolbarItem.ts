import { Direction } from "@constants/enum.constants";

import { ToolbarItemButton } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { BondTool, Chain, Erase } from "../tools";
import DebugTools from "../tools/debug_tools";

let currentDebugTools = DebugTools;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
} else {
    currentDebugTools = [];
}

const toolbarItemsList: ToolbarItemButton[] = [
    Erase,
    BondTool.singleBond,
    BondTool.doubleBond,
    BondTool.tripleBond,
    BondTool.singleOrDoubleBond,
    BondTool.wedgeBackBond,
    BondTool.wedgeFrontBond,
    Chain,
    ...currentDebugTools,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Left,
};

export default props;
