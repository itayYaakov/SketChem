import { Svg } from "@svgdotjs/svg.js";

let mCanvas: Svg | undefined;

export const CanvasObject = {
    get() {
        return mCanvas;
    },

    set(canvas: Svg) {
        mCanvas = canvas;
    },
};
