import { Direction } from "@constants/enum.constants";

import { ToolbarItemButton } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { bondToolBarItems, Chain, Delete } from "../tools";
// !!! delete
import DebugTools from "../tools/debug_tools";

const toolbarItemsList: ToolbarItemButton[] = [
    Delete.deleteBox,
    bondToolBarItems.singleBond,
    bondToolBarItems.doubleBond,
    bondToolBarItems.tripleBond,
    bondToolBarItems.wedgeBackBond,
    bondToolBarItems.wedgeFrontBond,
    Chain,
    DebugTools.DrawMol,
    DebugTools.DrawAtoms,
    DebugTools.DrawBonds,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Left,
};

export default props;
