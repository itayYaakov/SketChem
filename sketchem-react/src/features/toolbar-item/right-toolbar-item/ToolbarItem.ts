import { Direction } from "@constants/enum.constants";

import { ToolbarItemButton } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { Charge, DefaultAtomButtons, PeriodicTableTool } from "../tools";

const toolbarItemsList: ToolbarItemButton[] = [
    Charge.ChargePlus,
    Charge.ChargeMinus,
    PeriodicTableTool,
    ...DefaultAtomButtons,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Right,
};

export default props;
