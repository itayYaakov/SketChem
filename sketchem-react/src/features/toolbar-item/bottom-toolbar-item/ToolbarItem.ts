import { Direction } from "@constants/enum.constants";

import { ToolbarItemButton } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";

const toolbarItemsList: ToolbarItemButton[] = [];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Bottom,
};

export default props;
