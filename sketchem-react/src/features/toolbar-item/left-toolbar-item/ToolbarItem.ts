import { Direction } from "@constants/enum.constants";

import { ToolbarItem } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { bondToolBarItems } from "../tools";

const toolbarItemsList: ToolbarItem[] = [
    bondToolBarItems.singleBond,
    bondToolBarItems.doubleBond,
    bondToolBarItems.tripleBond,
    bondToolBarItems.wedgeBackBond,
    bondToolBarItems.wedgeFrontBond,
    {
        name: "Atom",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ToolbarItem,
    {
        name: "Double Bond",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ToolbarItem,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Left,
};

export default props;
