import { Direction } from "@constants/enum.constants";

import { ActiveToolbarItem } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { bondToolBarItems, Export, Import, selectToolBarItems } from "../tools";

const toolbarItemsList: ActiveToolbarItem[] = [
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
