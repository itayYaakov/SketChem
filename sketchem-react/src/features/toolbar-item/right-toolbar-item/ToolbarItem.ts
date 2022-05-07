import { Direction } from "@constants/enum.constants";

import { ToolbarItem } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";

const toolbarItemsList: ToolbarItem[] = [
    {
        name: "Empty 1",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ToolbarItem,
    {
        name: "Empty 2",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ToolbarItem,
    {
        name: "Empty 3",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ToolbarItem,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Right,
};

export default props;
