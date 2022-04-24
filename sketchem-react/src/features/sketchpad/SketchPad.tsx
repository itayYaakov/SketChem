/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import { getToolbarItem } from "@app/selectors";
import GetToolbarByName from "@features/toolbar-item/GetToolbarByName";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Two from "two.js";
// import { Vector } from 'two.js/src/vector';
import { Anchor } from "two.js/src/anchor";
import { Collection } from "two.js/src/collection";
import { Path } from "two.js/src/path";
import { Rectangle } from "two.js/src/shapes/rectangle";

interface Props {
    // width: number;
    // height: number;
}

function makeCurve(two: Two, points: Anchor[], close_flag?: boolean): Path {
    const last = close_flag;
    const curve = new Path(points, !(typeof last === "boolean" ? last : undefined), true);
    const rect = curve.getBoundingClientRect();
    curve.center().translation.set(rect.left + rect.width / 2, rect.top + rect.height / 2);

    two.scene.add(curve);

    return curve;
}

function getBackgroundColor(stringInput: string): string {
    // eslint-disable-next-line no-bitwise
    const stringUniqueHash = [...stringInput].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
}

function SketchPad(props: Props) {
    interface Point {
        x: number;
        y: number;
    }

    const divDomElement = useRef<HTMLDivElement>(null!);
    const svgDomElement = useRef<HTMLDivElement>(null!);
    let MouseIsPressed = false;
    const mouse = new Two.Vector();
    const color = useRef<string>(getBackgroundColor(""));

    let line: Path | null;

    const twoRef = useRef<Two>(null!);

    function calculateLocation(e: MouseEvent): Point {
        if (!svgDomElement.current) return { x: 0, y: 0 };
        const rect = svgDomElement.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.x,
            y: e.clientY - rect.y,
        };
    }

    function makePoint(x: number, y: number) {
        const v = new Two.Anchor(x, y);
        // v.position = new Two.Vector().copy(v);

        return v;
    }

    function handleMouseDown(e: MouseEvent) {
        e.preventDefault();

        MouseIsPressed = true;
        line = null;
        const { x, y } = calculateLocation(e);
        // console.log("down x=", x, "y=", y);
        mouse.set(x, y);
        // const loc = calculateLocation(e);
    }
    function handleMouseMove(e: MouseEvent) {
        e.preventDefault();

        if (!MouseIsPressed) return;

        const { x, y } = calculateLocation(e);
        // console.log("move x=", x, "y=", y);
        if (line == null) {
            const v1 = makePoint(mouse.x, mouse.y);
            const v2 = makePoint(x, y);
            line = makeCurve(twoRef.current, [v1, v2], true);
            line.noFill().stroke = color.current;
            line.linewidth = 10;
            line.vertices.forEach((v: Anchor) => {
                v.addSelf(line?.translation);
            });
            line.translation.clear();
        } else {
            const v1 = makePoint(x, y);
            line.vertices.push(v1);
        }
        mouse.set(x, y);
        twoRef?.current?.update();
    }

    function handleMouseUp(e: MouseEvent) {
        e.preventDefault();

        // const mouseClickUpPoint = calculateLocation(e);
        MouseIsPressed = false;
        twoRef?.current?.update();
    }

    function setup() {
        let rect: Rectangle;
        let rect2: Rectangle;

        if (twoRef.current) {
            console.log("Need to check what are the instances!");
            console.log(twoRef.current);
            console.log(Two.Instances);
            Two.Instances = Two.Instances.filter((i) => i !== twoRef.current);
        }

        twoRef.current = new Two({
            fullscreen: false,
            fitted: true,
            autostart: false,
            type: Two.Types.svg,
        }).appendTo(divDomElement.current);

        function update() {
            rect.rotation += 0.1;
            // rect2.id = `HI there ${Date.now()}`;
        }

        const two = twoRef.current;
        svgDomElement.current = twoRef.current.renderer.domElement;

        rect = two.makeRectangle(two.width / 2, two.height / 2, 50, 50);
        rect2 = two.makeRectangle(two.width / 3, two.height / 2, 80, 80);
        // how to add event listener to an object
        // line.renderer.elem.addEventListener('click', click, false);

        console.log(rect);
        two.bind("update", update);

        function unmount() {
            two.clear();
            two.unbind("update");
            svgDomElement.current.removeEventListener("mousedown", handleMouseDown);
            svgDomElement.current.removeEventListener("mousemove", handleMouseMove);
            svgDomElement.current.removeEventListener("mouseup", handleMouseUp);
            divDomElement.current.removeChild(two.renderer.domElement);
        }

        svgDomElement.current.addEventListener("mousedown", handleMouseDown);
        svgDomElement.current.addEventListener("mousemove", handleMouseMove);
        svgDomElement.current.addEventListener("mouseup", handleMouseUp);

        two.update();
        return unmount;
    }

    useEffect(setup, []);

    const toolbarname = GetToolbarByName(useSelector(getToolbarItem).selectedToolbarItem);
    console.log(`toolbarname=${toolbarname?.name} inside SketchPad!!`);
    twoRef?.current?.update();
    color.current = getBackgroundColor(toolbarname?.name ?? "");
    console.log(color.current);
    return <div ref={divDomElement} className={clsx(styles.sketchpad, "h-100")} />;
}

SketchPad.defaultProps = {
    // width: 1000,divDomElement
    // height: 1500,
};

export default SketchPad;
