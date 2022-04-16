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
    new ToolbarItem(
        "Triple Bound",
        () => {},
        () => {},
        ["A"]
    ),
    new ToolbarItem(
        "Quatro Bound",
        () => {},
        () => {},
        ["A"]
    ),
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Right,
};

export default props;
