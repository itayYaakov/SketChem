/* eslint-disable react/style-prop-object */
import "@styles/App.scss";

import Editor from "@features/editor/Editor";
import { EditorHandler } from "@features/editor/EditorHandler";
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

const editorHandler = new EditorHandler();

function App() {
    // if (loading) {
    //   return <AppLoading />;
    // }

    return (
        <div className={clsx("App", styles.app)}>
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

            <div className={styles.draw}>
                <Editor editorHandler={editorHandler} />
                {/* SVG sketchpad is placed here */}
            </div>

            <DialogShow editorHandler={editorHandler} />
        </div>
    );
}

export default App;
