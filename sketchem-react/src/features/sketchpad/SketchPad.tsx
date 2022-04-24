/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import { getToolbarItem } from "@app/selectors";
import { Direction, MouseButtons } from "@constants/enum.constants";
import GetToolbarByName from "@features/toolbar-item/GetToolbarByName";
import styles from "@styles/index.module.scss";
import { MouseEventCallBackProperties } from "@types";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Two from "two.js";
import { Anchor } from "two.js/src/anchor";
import { Collection } from "two.js/src/collection";
import { Path } from "two.js/src/path";
import { Rectangle } from "two.js/src/shapes/rectangle";
import { Vector } from "two.js/src/vector";

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
    const divDomElement = useRef<HTMLDivElement>(null!);
    const svgDomElement = useRef<HTMLDivElement>(null!);
    const activeToolBar = GetToolbarByName(useSelector(getToolbarItem).selectedToolbarItem);

    const color = useRef<string>(getBackgroundColor(""));

    let line: Path | null;

    const twoRef = useRef<Two>(null!);

    const mouseEventsSetListeners = (function mouseEventsHandler() {
        let mouseDownLocation: Vector | undefined;

        function calculateLocation(e: MouseEvent): Vector {
            if (!svgDomElement.current) return new Two.Vector(0, 0);
            const rect = svgDomElement.current.getBoundingClientRect();
            return new Two.Vector(e.clientX - rect.x, e.clientY - rect.y);
        }

        function handleMouseDown(e: MouseEvent) {
            e.preventDefault();

            line = null;
            mouseDownLocation = calculateLocation(e);
            const args = { e, mouseDownLocation, mouseUpLocation: undefined } as MouseEventCallBackProperties;
        }

        function handleMouseMove(e: MouseEvent) {
            e.preventDefault();

            if (e.buttons !== MouseButtons.Left) return;
            if (!mouseDownLocation) return;

            const { x, y } = calculateLocation(e);
            if (line == null) {
                const v1 = new Two.Anchor(mouseDownLocation.x, mouseDownLocation.y);
                const v2 = new Two.Anchor(x, y);
                line = makeCurve(twoRef.current, [v1, v2], true);
                line.noFill().stroke = color.current;
                line.linewidth = 10;
                line.vertices.forEach((v: Anchor) => {
                    v.addSelf(line?.translation);
                });
                line.translation.clear();
            } else {
                const v3 = new Two.Anchor(x, y);
                line.vertices.push(v3);
            }
            twoRef?.current?.update();
        }

        function handleMouseUp(e: MouseEvent) {
            e.preventDefault();

            const mouseUpLocation = calculateLocation(e);
            const args = { e, mouseDownLocation, mouseUpLocation } as MouseEventCallBackProperties;

            mouseDownLocation = undefined;
            twoRef?.current?.update();
        }

        function setListeners(object: any, enable: boolean) {
            if (enable) {
                svgDomElement.current.addEventListener("mousedown", handleMouseDown);
                svgDomElement.current.addEventListener("mousemove", handleMouseMove);
                svgDomElement.current.addEventListener("mouseup", handleMouseUp);
            } else {
                svgDomElement.current.removeEventListener("mousedown", handleMouseDown);
                svgDomElement.current.removeEventListener("mousemove", handleMouseMove);
                svgDomElement.current.removeEventListener("mouseup", handleMouseUp);
            }
        }

        return setListeners;
    })();

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
            mouseEventsSetListeners(svgDomElement.current, false);
            divDomElement.current.removeChild(two.renderer.domElement);
        }
        mouseEventsSetListeners(svgDomElement.current, true);

        two.update();
        return unmount;
    }

    useEffect(setup, []);

    console.log(`toolbarname=${activeToolBar?.name} inside SketchPad!!`);
    twoRef?.current?.update();
    color.current = getBackgroundColor(activeToolBar?.name ?? "");
    console.log(color.current);
    return <div ref={divDomElement} className={clsx(styles.sketchpad, "h-100")} />;
}

SketchPad.defaultProps = {
    // width: 1000,divDomElement
    // height: 1500,
};

export default SketchPad;
