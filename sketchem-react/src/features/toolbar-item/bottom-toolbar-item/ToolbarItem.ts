import { Direction } from "@constants/enum.constants";

import ToolbarItem from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";

const toolbarItemsList: ToolbarItem[] = [
    new ToolbarItem(
        "Clear",
        () => {},
        () => {},
        ["A"]
    ),
    new ToolbarItem(
        "Clear 2",
        () => {},
        () => {},
        ["A"]
    ),
    new ToolbarItem(
        "Clear 3",
        () => {},
        () => {},
        ["A"]
    ),
    new ToolbarItem(
        "Clear 4",
        () => {},
        () => {},
        ["A"]
    ),
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Bottom,
};

export default props;
