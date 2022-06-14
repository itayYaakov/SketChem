import { Direction } from "@constants/enum.constants";

import { ToolbarItemButton } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { BondTool, ClearCanvas, Copy, Export, Import, Paste, selectToolBarItems } from "../tools";

const toolbarItemsList: ToolbarItemButton[] = [
    ClearCanvas,
    Copy,
    Paste,
    Import,
    Export,
    selectToolBarItems.simpleSelect,
    selectToolBarItems.lassoSelect,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Top,
};

export default props;
