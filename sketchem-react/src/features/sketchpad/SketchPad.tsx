/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import { getToolbarItem } from "@app/selectors";
import { Direction, MouseButtons } from "@constants/enum.constants";
import GetToolbarByName from "@features/toolbar-item/GetToolbarByName";
import ToolbarItem from "@features/toolbar-item/ToolbarItem";
import styles from "@styles/index.module.scss";
import { Number as SVGNumber, SVG, Svg } from "@svgdotjs/svg.js";
import { MouseEventCallBackProperties, MouseEventCallBackResponse } from "@types";
import Vector2 from "@utils/mathsTs/Vector2";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Two from "two.js";

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
    const svgDomElement = useRef<HTMLDivElement>(null!);
    const activeToolBar = useRef<ToolbarItem>(null!);
    activeToolBar.current = GetToolbarByName(useSelector(getToolbarItem).selectedToolbarItem);

    const color = useRef<string>(getBackgroundColor(""));

    const svgRef = useRef<Svg>(null!);

    const mouseEventsSetListeners = (function mouseEventsHandler() {
        let mouseDownLocation: Vector2 | undefined;

        function calculateLocation(e: MouseEvent): Vector2 {
            if (!svgRef.current) return new Vector2(0, 0);
            const { x, y } = svgRef.current.point(e.clientX, e.clientY);
            return new Vector2(x, y);
        }

        function handleMouseDown(e: MouseEvent) {
            e.preventDefault();

            mouseDownLocation = calculateLocation(e);
            const args = {
                e,
                canvas: svgRef.current,
                mouseDownLocation,
                mouseCurrentLocation: mouseDownLocation,
                mouseUpLocation: undefined,
            } as MouseEventCallBackProperties;
            activeToolBar.current?.onMouseDown?.(args);
        }

        function handleMouseMove(e: MouseEvent) {
            e.preventDefault();

            if (e.buttons !== MouseButtons.Left) return;
            if (!mouseDownLocation) return;

            const mouseCurrentLocation = calculateLocation(e);
            const args = {
                e,
                canvas: svgRef.current,
                mouseDownLocation,
                mouseCurrentLocation,
                mouseUpLocation: undefined,
            } as MouseEventCallBackProperties;

            const response = activeToolBar.current?.onMouseMove?.(args);
            // find a better way
            // if (response && "shape" in response) {
            // }
        }

        function handleMouseUp(e: MouseEvent) {
            e.preventDefault();

            const mouseUpLocation = calculateLocation(e);
            const args = {
                e,
                canvas: svgRef.current,
                mouseDownLocation,
                mouseCurrentLocation: mouseUpLocation,
                mouseUpLocation,
            } as MouseEventCallBackProperties;
            activeToolBar.current?.onMouseUp?.(args);

            mouseDownLocation = undefined;
        }

        function setListeners(object: any, enable: boolean) {
            if (enable) {
                object.on("mousedown", handleMouseDown);
                object.on("mousemove", handleMouseMove);
                object.on("mouseup", handleMouseUp);
            } else {
                object.off("mousedown", handleMouseDown);
                object.off("mousemove", handleMouseMove);
                object.off("mouseup", handleMouseUp);
            }
        }

        return setListeners;
    })();

    function setup() {
        const draw = SVG().addTo(divDomElement.current).size("100%", "100%");
        svgRef.current = draw;
        // const width = Number(draw.width().valueOf());
        // const height = Number(draw.height().valueOf());
        SetDefs(draw);

        function unmount() {
            mouseEventsSetListeners(svgRef.current, false);
            divDomElement.current.removeChild(svgRef.current.node);
        }
        mouseEventsSetListeners(svgRef.current, true);

        return unmount;
    }

    useEffect(setup, []);

    console.log(`toolbarname=${activeToolBar.current?.name} inside SketchPad!!`);
    color.current = getBackgroundColor(activeToolBar.current?.name ?? "");
    console.log(color.current);
    return <div ref={divDomElement} className={clsx(styles.sketchpad, "h-100")} />;
}

SketchPad.defaultProps = {
    // width: 1000,divDomElement
    // height: 1500,
};

export default SketchPad;
