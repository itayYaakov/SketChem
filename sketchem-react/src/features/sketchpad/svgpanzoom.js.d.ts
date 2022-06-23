/* eslint-disable @typescript-eslint/naming-convention */
export enum MouseButton {
    left = 0,
    middle,
    right,
    back,
    forth,
}

interface marginOptions {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

interface options {
    panning?: boolean;
    pinchZoom?: boolean;
    touchpadFactor?: number;
    wheelZoom?: boolean;
    panButton?: MouseButton;
    oneFingerPan?: boolean;
    margins?: boolean | marginOptions;
    zoomFactor?: number;
    zoomMin?: number;
    zoomMax?: number;
    wheelZoomDeltaModeLinePixels?: number;
    wheelZoomDeltaModeScreenPixels?: number;
}

declare module "@svgdotjs/svg.js" {
    interface Svg {
        panZoom(options?: options | false): this;
    }
}
