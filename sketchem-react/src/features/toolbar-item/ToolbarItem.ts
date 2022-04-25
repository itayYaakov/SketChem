import { MouseEventCallBackProperties, MouseEventCallBackResponse } from "@types";

export default interface ToolbarItem {
    readonly name: string;

    readonly onMouseDown?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onMouseMove?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly onMouseUp?: (e: MouseEventCallBackProperties) => MouseEventCallBackResponse | void;

    readonly keyboardKeys?: string[];
}
