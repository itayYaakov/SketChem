import b from "./bottom-toolbar-item/ToolbarItem";
import l from "./left-toolbar-item/ToolbarItem";
import r from "./right-toolbar-item/ToolbarItem";
import type ToolbarItem from "./ToolbarItem";
import t from "./top-toolbar-item/ToolbarItem";

const toolbarItemsList: ToolbarItem[] = [
    ...b.toolbarItemsList,
    ...l.toolbarItemsList,
    ...r.toolbarItemsList,
    ...t.toolbarItemsList,
];
const toolbarItemsDict = Object.assign({}, ...toolbarItemsList.map((x: ToolbarItem) => ({ [x.name]: x })));

export default function GetToolbarByName(name: string): ToolbarItem {
    const item: ToolbarItem = toolbarItemsDict[name];
    return item;
}
