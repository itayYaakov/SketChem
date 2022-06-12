import { ToolbarItem } from "../ToolbarItem";

const toolbarItemsDict = new Map<string, ToolbarItem>();

export function RegisterToolbarWithName(name: string, tool: ToolbarItem) {
    if (toolbarItemsDict.has(name)) {
        throw new Error(`Toolbar with name ${name} already registered`);
    }
    toolbarItemsDict.set(name, tool);
}

export function GetToolbarByName(name: string): ToolbarItem | undefined {
    if (!name) return undefined;
    const item = toolbarItemsDict.get(name);
    if (!item) {
        throw new Error(`Toolbar with name ${name} not registered`);
    }
    return item;
}
