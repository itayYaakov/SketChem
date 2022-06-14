import { ToolbarAction } from "@src/types";

import { isDialogToolbarItem, ToolbarItemButton } from "./ToolbarItem";
import { actions } from "./toolbarItemsSlice";
import { GetToolbarByName } from "./tools/ToolsMapper.helper";

const toolbarItemsButtonsDict = new Map<string, ToolbarItemButton>();
export function RegisterToolbarButtonWithName(tool: ToolbarItemButton) {
    const name = tool.subToolName ?? tool.toolName;
    if (toolbarItemsButtonsDict.has(name)) {
        throw new Error(`Toolbar button with name ${name} already registered`);
    }
    toolbarItemsButtonsDict.set(name, tool);
}

export function GetToolbarButtonByName(name: string): ToolbarItemButton | undefined {
    if (!name) return undefined;
    const item = toolbarItemsButtonsDict.get(name);
    if (!item) {
        throw new Error(`Toolbar Button with name ${name} not registered`);
    }
    return item;
}

export function IsToolbarButtonExists(tool: ToolbarItemButton): boolean {
    const name = tool.subToolName ?? tool.toolName;
    return toolbarItemsButtonsDict.has(name);
}

export function SentDispatchEventWhenToolbarItemIsChanges(dispatch: any, name: string) {
    const toolButton = GetToolbarButtonByName(name);
    if (!toolButton) return;
    const tool = GetToolbarByName(toolButton.toolName);
    if (!tool) return;

    if (isDialogToolbarItem(tool)) {
        dispatch(actions.dialog(toolButton.toolName));
    } else {
        const payload: ToolbarAction = {
            toolName: toolButton.toolName,
        };
        const { attributes, subToolName } = toolButton;
        if (attributes) payload.attributes = attributes;
        if (subToolName) payload.subToolName = subToolName;

        dispatch(actions.asyncDispatchTool(payload));
    }
}
