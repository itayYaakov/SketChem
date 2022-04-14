import ToolbarItem from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
import { Direction } from "@constants/enum.constants";

const toolbarItemsList: ToolbarItem[] = [
    new ToolbarItem(
        "Clear",
        function noop() {},
        function noop() {},
        ["A"]
    ),
    new ToolbarItem(
        "Clear 2",
        function noop() {},
        function noop() {},
        ["A"]
    ),
    new ToolbarItem(
        "Clear 3",
        function noop() {},
        function noop() {},
        ["A"]
    ),
    new ToolbarItem(
        "Clear 4",
        function noop() {},
        function noop() {},
        ["A"]
    ),
];

const props: IToolbarItemsProps = {
    toolbarItemsList: toolbarItemsList,
    direction: Direction.Bottom,
};

export default props;
