import { Direction } from "@constants/enum.constants";

import { ToolbarItem } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { Charge } from "../tools";

const toolbarItemsList: ToolbarItem[] = [Charge.ChargePlus, Charge.ChargeMinus];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Right,
};

export default props;
