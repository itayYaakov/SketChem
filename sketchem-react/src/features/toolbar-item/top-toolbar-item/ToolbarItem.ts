import { Direction } from "@constants/enum.constants";

import ToolbarItem from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { DrawMeOther } from "../tools";

const toolbarItemsList: ToolbarItem[] = [
    DrawMeOther,
    {
        name: "Atom 1",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ToolbarItem,
    {
        name: "Bond 2",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ToolbarItem,
    {
        name: "Bond 3",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ToolbarItem,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Top,
};

export default props;
