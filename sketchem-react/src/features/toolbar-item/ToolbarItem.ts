import { MouseEventCallBackProperties } from "@types";

export default interface ToolbarItem {
    readonly name: string;

    readonly onMouseDown?: (e: MouseEventCallBackProperties) => void;

    readonly onMouseMove?: (e: MouseEventCallBackProperties) => void;

    readonly onMouseUp?: (e: MouseEventCallBackProperties) => void;

    readonly keyboardKeys?: string[];
}
