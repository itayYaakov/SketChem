/* eslint-disable max-classes-per-file */
import { useAppDispatch } from "@app/hooks";
import { actions } from "@features/chemistry/chemistrySlice";
import { ActionItem } from "@types";
import React from "react";

// store.dispatch(actions.update_history([historyItem]));
let currentHistoryHolder: ActionItem[] = [];

class EditorObj {
    dispatch: any;

    constructor(dispatch: any) {
        this.dispatch = dispatch;
    }

    addHistoryItem(historyItem: ActionItem) {
        currentHistoryHolder.push(historyItem);
    }

    sealHistory() {
        // There's a problem with center beeing unserialized
        // this.dispatch!(actions.update_history(currentHistoryHolder));
        currentHistoryHolder = [];
    }
}

// eslint-disable-next-line import/no-mutable-exports
let editorObj: EditorObj;
export { editorObj };

function Editor(props: { children: JSX.Element }) {
    const { children } = props;
    const dispatch = useAppDispatch();
    editorObj = new EditorObj(dispatch);
    return children;
}

export default Editor;
