import ToolbarItem from '../ToolbarItem';
import type { IToolbarItemsProps } from '../ToolbarItems';
import { Direction } from '@constants/enum.constants';

const toolbarItemsList: ToolbarItem[] = [
    new ToolbarItem("Clear", function noop() { }, function noop() { }, ["A"]),
    new ToolbarItem("Bond", function noop() { }, function noop() { }, ["A"]),
    new ToolbarItem("Atom", function noop() { }, function noop() { }, ["A"]),
    new ToolbarItem("Double Bound", function noop() { }, function noop() { }, ["A"]),
    new ToolbarItem("Triple Bound", function noop() { }, function noop() { }, ["A"]),
    new ToolbarItem("Quatro Bound", function noop() { }, function noop() { }, ["A"]),
];

const props : IToolbarItemsProps = {
    toolbarItemsList: toolbarItemsList,
    direction: Direction.Right,
}

export default props;