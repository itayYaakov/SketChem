/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-use-before-define */
import Raphael from "raphael";
import { useRef } from "react";

interface Point {
    x: number;
    y: number;
}

function useOnDraw() {
    // ref for the canvas dom element
    const divRef = useRef<HTMLDivElement>(null!);

    let isMousePressedRef = false;
    let paper: any = null;
    let shape: any = null;
    function calculateLocation(event: MouseEvent): Point {
        const rect = divRef.current.getBoundingClientRect();
        return {
            x: event.clientX - rect.x,
            y: event.clientY - rect.y,
        };
    }

    function setdivRef(ref: any) {
        if (!ref) return;
        divRef.current = ref;
        // Setting mouse listeners
        setMouseDownListener();
        setMouseUpListener();
        setMouseMoveListener();
        console.log(divRef.current);
        // Initialize rapahel paper
        paper = Raphael(divRef.current, 1500, 1000);
    }

    // creating and drawing a line using rapahel's svg path
    function drawLine(startPoint: Point, endPoint: Point) {
        let start = startPoint;
        let end = endPoint;
        const getPath = function () {
            return ["M", start.x, start.y, "L", end.x, end.y];
        };

        const path = paper.path(getPath());
        const redraw = function () {
            path.attr("path", getPath());
        };
        return {
            updateStart(point: Point) {
                start = point;
                redraw();
                return this;
            },
            updateEnd(point: Point) {
                end = point;
                redraw();
                return this;
            },
        };
    }

    // creating and drawing a circle using rapahel's svg path
    function drawCircle(start: Point, end: Point) {
        function calculateCenter(p1: Point, p2: Point) {
            return {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
            };
        }
        function calculateRadius(p1: Point, p2: Point) {
            return {
                h: Math.sqrt((p2.y - p1.y) * (p2.y - p1.y)) / 2,
                w: Math.sqrt((p2.x - p1.x) * (p2.x - p1.x)) / 2,
            };
        }
        const params = {
            center: calculateCenter(start, end),
            radius: calculateRadius(start, end),
        };

        const getPath = function () {
            console.log(params);
            return [
                ["M", params.center.x, params.center.y],
                ["m", 0, -params.radius.h],
                ["a", params.radius.w, params.radius.h, 0, 1, 1, 0, 2 * params.radius.h],
                ["a", params.radius.w, params.radius.h, 0, 1, 1, 0, -2 * params.radius.h],
                ["z"],
            ];
        };
        console.log(getPath());
        const redraw = function () {
            node.attr("path", getPath());

            node.attr({ stroke: "red" });
        };
        var node = paper.path(getPath());
        console.log(node);

        return {
            updateStart(newStart: Point) {
                params.center = calculateCenter(newStart, end);
                params.radius = calculateRadius(newStart, end);
                console.log(node);
                redraw();

                return this;
            },
            updateEnd(newEnd: Point) {
                console.log(start);
                console.log(newEnd);
                params.center = calculateCenter(start, newEnd);
                params.radius = calculateRadius(start, newEnd);
                redraw();
                console.log(node);

                return this;
            },
        };
    }

    function onDraw(point: Point) {
        // update the end location of the shape we curretly draw
        shape.updateEnd(point);
    }

    function setMouseDownListener() {
        if (!divRef.current) return;
        const downListener = (e: MouseEvent) => {
            console.log("mouse down");
            isMousePressedRef = true;
            const loc = calculateLocation(e);
            shape = drawCircle(loc, loc);

            console.log(shape);
        };
        divRef.current.addEventListener("mousedown", downListener);
    }

    function setMouseUpListener() {
        if (!divRef.current) return;
        const upListener = (e: MouseEvent) => {
            console.log("mouse up");
            isMousePressedRef = false;
            const mouseClickUpPoint = calculateLocation(e);
        };
        window.addEventListener("mouseup", upListener);
    }

    function setMouseMoveListener() {
        const MoveListener = (e: MouseEvent) => {
            // !!! console.log("mouse move");
            if (!isMousePressedRef) return;
            // call draw function - only when mouse is down.
            console.log({ x: e.screenX, y: e.screenY });
            onDraw(calculateLocation(e));
        };

        divRef.current.addEventListener("mousemove", MoveListener);
    }

    return setdivRef;
}

export { useOnDraw };
