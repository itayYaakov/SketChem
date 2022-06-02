// !!! replace with my custom file
import "./svgpanzoom";

import { useWindowSize } from "@app/resizeHook";
import { getToolbarItem } from "@app/selectors";
import { Direction, LayersNames, MouseButtons, MouseEventsNames } from "@constants/enum.constants";
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
import { MouseEventCallBackProperties, MouseEventCallBackResponse } from "@types";
import Vector2 from "@utils/mathsTs/Vector2";
import clsx from "clsx";
// import panzoom, { PanZoom } from "panzoom";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";

import SetDefs from "./SetDefs";

interface Props {
    // width: number;
    // height: number;
}

function getBackgroundColor(stringInput: string): string {
    // eslint-disable-next-line no-bitwise
    const stringUniqueHash = [...stringInput].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
}

function SketchPad(props: Props) {
    const divDomElement = useRef<HTMLDivElement>(null!);
    const initialZoomRatio = useRef<number>(0);

    const toolbarButtonRef = useRef<ToolbarItem>(null!);
    const activeToolbarButton = useRef<ActiveToolbarItem | undefined>(undefined);
    const currentToolbarName = useSelector(getToolbarItem, shallowEqual).selectedToolbarItem;

    if (currentToolbarName) {
        const currentToolbar = GetToolbarByName(currentToolbarName);

        if (currentToolbar) {
            toolbarButtonRef.current = currentToolbar;
            if (isDialogToolbarItem(toolbarButtonRef.current)) {
                activeToolbarButton.current = undefined;
            } else {
                activeToolbarButton.current = toolbarButtonRef.current;
            }
        } else {
            activeToolbarButton.current = undefined;
        }
    }

    // const color = useRef<string>(getBackgroundColor(""));

    const svgRef = useRef<Svg>(null!);
    // const panzoomRef = useRef<PanZoom>(null!);

    const setMouseEventsListeners = (function mouseEventsHandler() {
        let previousMouseLocation: Vector2 | undefined;
        let mouseDownLocation: Vector2 | undefined;
        let mouseUpLocation: Vector2 | undefined;

        function calculateLocation(e: MouseEvent): Vector2 {
            if (!svgRef.current) return Vector2.zero();
            const { x, y } = svgRef.current.point(e.clientX, e.clientY);
            return new Vector2(x, y);
        }

        function handleMouseClick(e: MouseEvent) {
            e.preventDefault();

            const mouseCurrentLocation = calculateLocation(e);
            const args = {
                e,
                canvas: svgRef.current,
                previousMouseLocation,
                mouseDownLocation: mouseCurrentLocation,
                mouseCurrentLocation,
                mouseUpLocation: mouseCurrentLocation,
            } as MouseEventCallBackProperties;

            const response = activeToolbarButton.current?.onMouseClick?.(args);
            previousMouseLocation = mouseCurrentLocation;
        }

        function handleMouseDown(e: MouseEvent) {
            e.preventDefault();

            if (e.buttons !== MouseButtons.Left) return;
            mouseDownLocation = calculateLocation(e);

            const args = {
                e,
                canvas: svgRef.current,
                previousMouseLocation,
                mouseDownLocation: mouseDownLocation.clone(),
                mouseCurrentLocation: mouseDownLocation.clone(),
                mouseUpLocation: undefined,
            } as MouseEventCallBackProperties;
            activeToolbarButton.current?.onMouseDown?.(args);
            previousMouseLocation = mouseDownLocation;
        }

        function handleMouseMove(e: MouseEvent) {
            e.preventDefault();

            if (e.buttons !== MouseButtons.Left) return;
            if (!mouseDownLocation) return;

            const mouseCurrentLocation = calculateLocation(e);
            const args = {
                e,
                canvas: svgRef.current,
                previousMouseLocation,
                mouseDownLocation: mouseDownLocation.clone(),
                mouseCurrentLocation,
                mouseUpLocation: undefined,
            } as MouseEventCallBackProperties;
            // !!! remove response?
            const response = activeToolbarButton.current?.onMouseMove?.(args);
            previousMouseLocation = mouseCurrentLocation;
        }

        function handleMouseUp(e: MouseEvent) {
            e.preventDefault();

            if (!mouseDownLocation) return;

            mouseUpLocation = calculateLocation(e);
            const args = {
                e,
                canvas: svgRef.current,
                previousMouseLocation,
                mouseDownLocation: mouseDownLocation.clone(),
                mouseCurrentLocation: mouseUpLocation,
                mouseUpLocation,
            } as MouseEventCallBackProperties;
            activeToolbarButton.current?.onMouseUp?.(args);

            mouseDownLocation = undefined;
            previousMouseLocation = mouseUpLocation;
        }

        function handleMouseLeave(e: MouseEvent) {
            e.preventDefault();

            const mouseCurrentLocation = calculateLocation(e);
            const args = {
                e,
                canvas: svgRef.current,
                previousMouseLocation,
                mouseDownLocation,
                mouseCurrentLocation,
                mouseUpLocation,
            } as MouseEventCallBackProperties;
            activeToolbarButton.current?.onMouseLeave?.(args);

            mouseDownLocation = undefined;
            previousMouseLocation = mouseCurrentLocation;
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

    function resizeEvent() {
        // return;
        const pixelRatio = Math.round(window.devicePixelRatio * 100);
        if (svgRef.current.viewbox().height === 0) {
            const svgBoundRect = svgRef.current.node.getBoundingClientRect();
            const ratio = svgBoundRect.width / svgBoundRect.height;
            const viewBoxHeight = 1000;
            const viewBoxWidth = Math.ceil(viewBoxHeight * ratio * 1.01);
            svgRef.current.viewbox(0, 0, viewBoxWidth, viewBoxHeight);
            initialZoomRatio.current = pixelRatio;
            console.log("A The zomm level is:", svgRef.current.zoom());
            svgRef.current.zoom(1);
            console.log("B The zomm level is:", svgRef.current.zoom());
            return;
        }
        console.log("C The zomm level is:", svgRef.current.zoom());
        svgRef.current.zoom(pixelRatio / initialZoomRatio.current);
        console.log("D The zomm level is:", svgRef.current.zoom());
        // draw.attr({ preserveAspectRatio: "xMaxYMax meet" });
    }

    function setupSvg() {
        console.log("I was set up svg");
        const draw = SVG().addTo(divDomElement.current).size("100%", "100%");
        svgRef.current = draw;
        draw.addClass(clsx(styles.sketchpad));

        resizeEvent();

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
    useEffect(resizeEvent, [useWindowSize()]);
    // const size = useWindowSize();

    // console.log(`toolbarname=${activeToolBar.current?.name} inside SketchPad!!`);
    // color.current = getBackgroundColor(activeToolBar.current?.name ?? "");

    return (
        // <div ref={divDomElement} className="w-100 h-100">
        //     {/* <svg height="100%" width="100%" className={clsx(styles.sketchpad)} /> */}
        // </div>
        <div ref={divDomElement} className="w-100 h-100">
            {/* <svg
                // height="100%"
                // width="100%"
                preserveAspectRatio="xMinYMin slice"
                viewBox="0 0 1000 1000"
                className={clsx(styles.sketchpad)}
            /> */}
        </div>
    );
}

SketchPad.defaultProps = {
    // width: 1000,divDomElement
    // height: 1500,
};

export default SketchPad;
