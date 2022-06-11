import { useAppDispatch } from "@app/hooks";
import SketchPad from "@features/sketchpad/SketchPad";
import React from "react";

import { EditorHandler } from "./EditorHandler";

function Editor() {
    const dispatch = useAppDispatch();
    const editorHandler = new EditorHandler(dispatch);
    return <SketchPad editor={editorHandler} />;
}

export default Editor;
