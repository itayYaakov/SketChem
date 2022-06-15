import { Direction } from "@constants/enum.constants";

import { ToolbarItemButton } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import * as Tools from "../tools";

const toolbarItemsList: ToolbarItemButton[] = [
    Tools.ClearCanvas,
    Tools.Copy,
    Tools.Paste,
    Tools.UnReDo.undo,
    Tools.UnReDo.redo,
    Tools.Import,
    Tools.Export,
    Tools.SelectToolBarItems.simpleSelect,
    Tools.SelectToolBarItems.lassoSelect,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Top,
};

export default props;
