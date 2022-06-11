// !!! replace with my custom file
import "./svgpanzoom";

import { useWindowSize } from "@app/resizeHook";
import { getToolbarItemContext } from "@app/selectors";
import { Direction, LayersNames, MouseButtons, MouseEventsNames } from "@constants/enum.constants";
import type Editor from "@features/editor/Editor";
import { EditorHandler } from "@features/editor/EditorHandler";
import {
    ActiveToolbarItem,
    isDialogToolbarItem,
    ToolbarItem,
    ToolbarItemButton,
} from "@features/toolbar-item/ToolbarItem";
import { GetToolbarByName } from "@features/toolbar-item/tools/ToolsMapper.helper";
import { LayersUtils } from "@src/utils/LayersUtils";
import styles from "@styles/index.module.scss";
import { Number as SVGNumber, Point, SVG, Svg } from "@svgdotjs/svg.js";
import { MouseEventCallBackProperties, ToolbarAction } from "@types";
import Vector2 from "@utils/mathsTs/Vector2";
import clsx from "clsx";
// import panzoom, { PanZoom } from "panzoom";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";

import SetDefs from "./SetDefs";

interface Props {
    editor: EditorHandler;
}

function resizeEvent(svgObj: Svg, initialZoomRatio?: number) {
    // return;
    const pixelRatio = Math.round(window.devicePixelRatio * 100);
    if (initialZoomRatio === undefined) {
        const svgBoundRect = svgObj.node.getBoundingClientRect();
        const ratio = svgBoundRect.width / svgBoundRect.height;
        const viewBoxHeight = 1000;
        const viewBoxWidth = Math.ceil(viewBoxHeight * ratio * 1.01);
        svgObj.viewbox(0, 0, viewBoxWidth, viewBoxHeight);
        console.log("A The zomm level is:", svgObj.zoom());
        svgObj.zoom(1);
        console.log("B The zomm level is:", svgObj.zoom());
    } else {
        console.log("C The zomm level is:", svgObj.zoom());
        svgObj.zoom(pixelRatio / initialZoomRatio);
        console.log("D The zomm level is:", svgObj.zoom());
    }
    // draw.attr({ preserveAspectRatio: "xMaxYMax meet" });
}
function SketchPad(props: Props) {
    const divDomElement = useRef<HTMLDivElement>(null!);
    const initialZoomRatio = useRef<number>(0);

    const { editor } = props;
    const toolbarButtonRef = useRef<ToolbarItem>(null!);
    const activeToolbarButton = useRef<ActiveToolbarItem | undefined>(undefined);
    const previousToolbarContext = useRef<ToolbarAction | undefined>(undefined);
    const currentToolbarContext = useSelector(getToolbarItemContext);
    if (currentToolbarContext.button) {
        if (currentToolbarContext !== previousToolbarContext.current) {
            const currentToolbar = GetToolbarByName(currentToolbarContext.button);
            if (currentToolbar) {
                toolbarButtonRef.current = currentToolbar;
                if (isDialogToolbarItem(toolbarButtonRef.current)) {
                    activeToolbarButton.current = undefined;
                } else {
                    activeToolbarButton.current = toolbarButtonRef.current;
                    activeToolbarButton.current.onActivate?.(currentToolbarContext.attributes, editor);
                }
            } else {
                activeToolbarButton.current = undefined;
            }
        }
    }
    previousToolbarContext.current = currentToolbarContext;

    const svgRef = useRef<Svg>(null!);

    const setMouseEventsListeners = (function mouseEventsHandler() {
        let previousMouseLocation: Vector2 | undefined;
        let mouseDownLocation: Vector2 | undefined;

        function calculateLocation(e: MouseEvent): Vector2 {
            if (!svgRef.current) return Vector2.zero();
            const { x, y } = svgRef.current.point(e.clientX, e.clientY);
            return new Vector2(x, y);
        }

        function createNewEvent(e: MouseEvent): MouseEventCallBackProperties {
            e.preventDefault();
            const mouseCurrentLocation = calculateLocation(e);
            const args = {
                e,
                editor,
                previousMouseLocation,
                mouseDownLocation,
                mouseCurrentLocation,
            } as MouseEventCallBackProperties;
            previousMouseLocation = mouseCurrentLocation;
            return args;
        }

        function handleMouseClick(e: MouseEvent) {
            const args = createNewEvent(e);
            activeToolbarButton.current?.onMouseClick?.(args);
        }

        function handleMouseDown(e: MouseEvent) {
            e.preventDefault();

            if (e.buttons !== MouseButtons.Left) return;
            mouseDownLocation = calculateLocation(e);
            const args = createNewEvent(e);
            activeToolbarButton.current?.onMouseDown?.(args);
            previousMouseLocation = mouseDownLocation;
        }

        function handleMouseMove(e: MouseEvent) {
            e.preventDefault();

            if (e.buttons !== MouseButtons.Left) return;
            if (!mouseDownLocation) return;

            const args = createNewEvent(e);
            activeToolbarButton.current?.onMouseMove?.(args);
        }

        function handleMouseUp(e: MouseEvent) {
            e.preventDefault();

            if (!mouseDownLocation) return;

            const args = createNewEvent(e);
            activeToolbarButton.current?.onMouseUp?.(args);

            mouseDownLocation = undefined;
        }

        function handleMouseLeave(e: MouseEvent) {
            e.preventDefault();

            const args = createNewEvent(e);
            activeToolbarButton.current?.onMouseLeave?.(args);

            mouseDownLocation = undefined;
        }

        function setListeners(object: any, enable: boolean) {
            if (enable) {
                object.on(MouseEventsNames.onClick, handleMouseClick);
                object.on(MouseEventsNames.onMouseDown, handleMouseDown);
                object.on(MouseEventsNames.onMouseMove, handleMouseMove);
                object.on(MouseEventsNames.onMouseUp, handleMouseUp);
                object.on(MouseEventsNames.onMouseLeave, handleMouseLeave);
            } else {
                object.off(MouseEventsNames.onClick, handleMouseClick);
                object.off(MouseEventsNames.onMouseDown, handleMouseDown);
                object.off(MouseEventsNames.onMouseMove, handleMouseMove);
                object.off(MouseEventsNames.onMouseUp, handleMouseUp);
                object.off(MouseEventsNames.onMouseLeave, handleMouseLeave);
            }
        }

        return setListeners;
    })();

    function setupSvg() {
        console.log("I was set up svg");
        const draw = SVG().addTo(divDomElement.current).size("100%", "100%");
        svgRef.current = draw;
        draw.addClass(clsx(styles.sketchpad));

        const pixelRatio = Math.round(window.devicePixelRatio * 100);
        resizeEvent(svgRef.current);
        initialZoomRatio.current = pixelRatio;

        // const svgBoundRect = svgRef.current.node.getBoundingClientRect();
        // const ratio = svgBoundRect.width / svgBoundRect.height;
        // const viewBoxHeight = 1000;
        // const viewBoxWidth = Math.ceil(viewBoxHeight * ratio * 1.01);
        // draw.viewbox(0, 0, viewBoxWidth, viewBoxHeight);

        draw.panZoom({
            // wheelZoom: false,
            zoomMin: 0.2,
            zoomMax: 20,
            zoomFactor: 0.05,
            // {top, left, right, bottom}
            // margins: { top: 0, left: 0, right: 3000, bottom: 3000 },
            // wheelZoomDeltaModeLinePixels: 9,
            // wheelZoomDeltaModeScreenPixels: 27,
            panButton: 1,
            // panning: false,
        });

        // const vbox = draw.viewbox();
        // const factor = 1.03;
        // const xMin = vbox.x * factor;
        // const xMax = vbox.x2 / factor;
        // const yMin = vbox.y * factor;
        // const yMax = vbox.y2 / factor;

        // draw.rect(xMax - xMin, yMax - yMin)
        //     .move(xMin, yMin)
        //     .stroke({ color: "#00ff00", width: 10 });

        // draw.rect(80, 80).move(50, 50).fill({ color: "#0000cd" });

        // draw.line(xMin, yMin, xMin, yMax).stroke({ color: "#00ff00", width: 10 });
        // draw.line(xMin, yMin, xMax, yMin).stroke({ color: "#dd3f1b", width: 10 });
        // draw.line(xMin, yMax, xMax, yMax).stroke({ color: "#00aaff", width: 10 });
        // draw.line(xMax, yMin, xMax, yMax).stroke({ color: "#00fbcd", width: 10 });
        // draw.line(20, 20, 20, 3980).stroke({ color: "#00ff00", width: 10 });
        // draw.line(20, 20, 3980, 20).stroke({ color: "#dd3f1b", width: 10 });
        // draw.line(20, 3980, 3980, 3980).stroke({ color: "#00aaff", width: 10 });
        // draw.line(3980, 4, 3980, 3980).stroke({ color: "#00fbcd", width: 10 });
        // const draw = SVG().addTo(divDomElement.current).size("100%", "100%").zoom(1);

        // svgRef.current.css({ overflow: "hidden", position: "relative" });

        setMouseEventsListeners(svgRef.current, true);

        function unmount() {
            setMouseEventsListeners(svgRef.current, false);
            divDomElement?.current?.removeChild(svgRef.current.node);
        }

        return unmount;
    }

    useEffect(setupSvg, []);
    useEffect(() => SetDefs(svgRef.current), []);
    useEffect(() => LayersUtils.setLayers(svgRef.current), []);
    useEffect(() => resizeEvent(svgRef.current, initialZoomRatio.current), [useWindowSize()]);

    return <div ref={divDomElement} className="w-100 h-100" />;
}

export default SketchPad;
