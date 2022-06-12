import { AtomConstants } from "@constants/atom.constants";
import * as ToolsConstants from "@constants/tools.constants";
import { MouseEventCallBackProperties, ToolbarItemButtonAttributes } from "@types";

export interface ActiveToolbarItem {
    readonly onActivate?: (...params: any) => void;

    readonly onMouseDown?: (e: MouseEventCallBackProperties) => void;

    readonly onMouseMove?: (e: MouseEventCallBackProperties) => void;

    readonly onMouseUp?: (e: MouseEventCallBackProperties) => void;

    readonly onMouseClick?: (e: MouseEventCallBackProperties) => void;

    readonly onMouseLeave?: (e: MouseEventCallBackProperties) => void;

    readonly onDeactivate?: () => void;
}

export interface DialogToolbarItem {
    readonly DialogRender: (props: any) => JSX.Element;
}

export type ToolbarItem = ActiveToolbarItem | DialogToolbarItem;
export interface SimpleToolbarItemButton {
    name: string;

    toolName: ToolsConstants.ToolsNames;

    subToolName?: ToolsConstants.SubToolsNames | string;

    keyboardKeys?: string[];
}

export interface ToolbarItemButton extends SimpleToolbarItemButton {
    attributes?: ToolbarItemButtonAttributes;
}

export class SimpleToolbarItemButtonBuilder implements SimpleToolbarItemButton {
    name: string;

    toolName: ToolsConstants.ToolsNames;

    keyboardKeys?: string[];

    constructor(name: string, toolName: ToolsConstants.ToolsNames, keyboardKeys?: string[]) {
        this.name = name;
        this.toolName = toolName;
        this.keyboardKeys = keyboardKeys;
    }
}

export const isDialogToolbarItem = (o: ToolbarItem): o is DialogToolbarItem =>
    (o as DialogToolbarItem).DialogRender !== undefined;
