import { Direction } from "@constants/enum.constants";

import { ToolbarItem } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";

const toolbarItemsList: ToolbarItem[] = [
    {
        name: "Empty Button 1",
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
        keyboardKeys: ["A"],
    } as ToolbarItem,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Bottom,
};

export default props;
