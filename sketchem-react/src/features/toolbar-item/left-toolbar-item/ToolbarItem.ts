import { Direction } from "@constants/enum.constants";

import ToolbarItem from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";

const a = 8;

const toolbarItemsList: ToolbarItem[] = [
    new ToolbarItem(
        "Clear",
        () => {},
        () => {},
        ["A"]
    ),
    new ToolbarItem(
        "Bond",
        () => {},
        () => {},
        ["A"]
    ),
    new ToolbarItem(
        "Atom",
        () => {},
        () => {},
        ["A"]
    ),
    new ToolbarItem(
        "Double Bound",
        () => {},
        () => {},
        ["A"]
    ),
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Left,
};

export default props;
