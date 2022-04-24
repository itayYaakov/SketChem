/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import { getToolbarItem } from "@app/selectors";
import GetToolbarByName from "@features/toolbar-item/GetToolbarByName";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React from "react";
import { useSelector } from "react-redux";

import { useOnDraw } from "../useOnDraw";

interface Props {
    width: number;
    height: number;
}

function SketchPad(props: Props) {
    const setRef = useOnDraw();
    const toolbarname = GetToolbarByName(useSelector(getToolbarItem).selectedToolbarItem);
    console.log(`toolbarname=${toolbarname} inside useOnDraw!!`);

    return (
        <div
            // style={{
            //     height: 1000,
            //     width: 1500,
            //     border: "5px solid red",
            // }}
            className={clsx(styles.sketchpad)}
            id="Can"
            ref={setRef}
        />
    );
}

SketchPad.defaultProps = {
    width: 1000,
    height: 1500,
};

export default SketchPad;
