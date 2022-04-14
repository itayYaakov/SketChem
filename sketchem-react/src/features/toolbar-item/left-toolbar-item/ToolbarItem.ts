import ToolbarItem from '../ToolbarItem';
import type { IToolbarItemsProps } from '../ToolbarItems';
import { Direction } from '@constants/enum.constants';

let a = 8

const toolbarItemsList: ToolbarItem[] = [
    new ToolbarItem("Clear", function noop() { }, function noop() { }, ["A"]),
    new ToolbarItem("Bond", function noop() { }, function noop() { }, ["A"]),
    new ToolbarItem("Atom", function noop() { }, function noop() { }, ["A"]),
    new ToolbarItem("Double Bound", function noop() { }, function noop() { }, ["A"]),
];

const props: IToolbarItemsProps = {
    toolbarItemsList: toolbarItemsList,
    direction: Direction.Left,
};

export default props;