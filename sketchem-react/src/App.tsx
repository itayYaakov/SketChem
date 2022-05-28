/* eslint-disable react/style-prop-object */
import "@styles/App.scss";

import { KekuleShow } from "@features/chemistry/kekuleHandler";
import SketchPad from "@features/sketchpad/SketchPad";
import {
    BottomToolbarProps,
    DialogShow,
    LeftToolbarProps,
    RightToolbarProps,
    ToolbarItems,
    TopToolbarProps,
} from "@features/toolbar-item";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import ButtonsShowcase from "./buttons";
import logo from "./logo.svg";

function App() {
    // if (loading) {
    //   return <AppLoading />;
    // }

    return (
        // <div className={clsx("App", "w-100", "h-100", styles.app)}>
        <div className={clsx("App", styles.app)}>
            <KekuleShow />
            {/* <SketchPad /> */}

            {/* <div style={{ backgroundColor: "rgba(0,255,0,.2)", border: "3px solid #00f" }} className={styles.top}>
                top
            </div>
            <div style={{ backgroundColor: "rgba(0,0,255,.2)", border: "3px solid #00f" }} className={styles.right}>
                right
            </div>
            <div style={{ backgroundColor: "rgba(0,187,255,.2)", border: "3px solid #00f" }} className={styles.left}>
                left
            </div>
            <div style={{ backgroundColor: "rgba(220,0,4,.2)", border: "3px solid #00f" }} className={styles.bottom}>
                bottom
            </div>
            <div style={{ backgroundColor: "rgba(140,0,3,.2)", border: "3px solid #00f" }} className={styles.sketchpad}>
                Sketchpad
            </div> */}

            <div className={styles.top}>
                <ToolbarItems {...TopToolbarProps} />
            </div>

            <div className={styles.right}>
                <ToolbarItems {...RightToolbarProps} />
            </div>

            <div className={styles.bottom}>
                <ToolbarItems {...BottomToolbarProps} />
            </div>

            <div className={styles.left}>
                <ToolbarItems {...LeftToolbarProps} />
            </div>

            <div className={styles.sketchpad}>
                <SketchPad />
            </div>

            {/* <SketchPad className="sketchpad"/>
                <ToolbarItems {...RightToolbarProps} className={styles.right} />
                <ToolbarItems {...LeftToolbarProps} className={styles.left} />
                <ToolbarItems {...BottomToolbarProps} className={styles.bottom} /> */}

            <DialogShow />
        </div>
    );
}

export default App;
