import { MouseEventCallBackProperties, MouseEventCallBackResponse } from "@types";

export interface ActiveToolbarItem {
    readonly onActivate?: (params?: any) => void;

    readonly onMouseDown?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onMouseMove?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onMouseUp?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onMouseClick?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onMouseLeave?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onDeactivate?: () => void;
}

export interface DialogToolbarItem {
    readonly DialogRender: (props: any) => JSX.Element;
}

export interface ChargeToolbarData {
    readonly charge: number;
}

export type ToolbarItem = ActiveToolbarItem | DialogToolbarItem;
export interface SimpleToolbarItemButton {
    name: string;

    toolName: string;

    keyboardKeys?: string[];
}
export interface ToolbarItemButton extends SimpleToolbarItemButton {
    attributes?: any;
}

export class SimpleToolbarItemButtonBuilder implements SimpleToolbarItemButton {
    name: string;

    toolName: string;

    keyboardKeys?: string[];

    constructor(name: string, toolName: string, keyboardKeys?: string[]) {
        this.name = name;
        this.toolName = toolName;
        this.keyboardKeys = keyboardKeys;
    }
}

export const isDialogToolbarItem = (o: ToolbarItem): o is DialogToolbarItem =>
    (o as DialogToolbarItem).DialogRender !== undefined;
