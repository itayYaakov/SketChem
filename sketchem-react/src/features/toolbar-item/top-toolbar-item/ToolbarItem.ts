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
        "Double Bound",
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
        "Bondd",
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
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Top,
};

export default props;
