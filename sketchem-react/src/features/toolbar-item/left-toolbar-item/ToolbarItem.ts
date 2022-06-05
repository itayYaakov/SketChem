import { Direction } from "@constants/enum.constants";

import { ToolbarItemButton } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { BondTool, Chain, Delete } from "../tools";
// !!! delete
import DebugTools from "../tools/debug_tools";

const toolbarItemsList: ToolbarItemButton[] = [
    Delete.deleteBox,
    BondTool.singleBond,
    BondTool.doubleBond,
    BondTool.tripleBond,
    BondTool.wedgeBackBond,
    BondTool.wedgeFrontBond,
    Chain,
    ...DebugTools,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Left,
};

export default props;
