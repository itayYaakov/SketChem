import { Direction } from "@constants/enum.constants";

import { ToolbarItemButton } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { bondToolBarItems, ClearCanvas, Export, Import, selectToolBarItems } from "../tools";

const toolbarItemsList: ToolbarItemButton[] = [
    ClearCanvas,
    Import,
    // Export,
    selectToolBarItems.simpleSelect,
    selectToolBarItems.lassoSelect,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Top,
};

export default props;
