import { MouseEventCallBackProperties, MouseEventCallBackResponse } from "@types";

export interface ActiveToolbarItem {
    readonly name: string;

    readonly onActivate?: () => void;

    readonly onMouseDown?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onMouseMove?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onMouseUp?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onMouseClick?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onMouseLeave?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onDeactivate?: () => void;

    readonly keyboardKeys?: string[];
}

export interface DummyToolbarItem {
    readonly name: string;

    readonly DialogRender: (props: any) => JSX.Element;

    readonly keyboardKeys?: string[];
}

export type ToolbarItem = ActiveToolbarItem | DummyToolbarItem;

export const isDummyToolbarItem = (o: ToolbarItem): o is DummyToolbarItem =>
    (o as DummyToolbarItem).DialogRender !== undefined;
