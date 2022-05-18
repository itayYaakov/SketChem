import { Direction } from "@constants/enum.constants";

import { ActiveToolbarItem } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { bondToolBarItems, Import, selectToolBarItems } from "../tools";

const toolbarItemsList: ActiveToolbarItem[] = [
    Import,
    bondToolBarItems.tripleBond,
    selectToolBarItems.simpleSelect,
    selectToolBarItems.lassoSelect,
    {
        name: "Atom 2",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ActiveToolbarItem,
    {
        name: "Atom 3",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ActiveToolbarItem,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Top,
};

export default props;
