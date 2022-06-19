/* eslint-disable react/jsx-pascal-case */
import { useAppDispatch } from "@app/hooks";
import { getToolbarDialog } from "@app/selectors";
import * as ToolsConstants from "@constants/tools.constants";
import { EditorHandler } from "@features/editor/EditorHandler";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";

import { isDialogToolbarItem } from "./ToolbarItem";
import { GetToolbarByName } from "./tools/ToolsMapper.helper";
import { SentDispatchEventWhenToolbarItemIsChanges } from "./ToolsButtonMapper.helper";

export function DialogShow(myProps: { editorHandler: EditorHandler }) {
    const dispatch = useAppDispatch();
    const { editorHandler: editor } = myProps;
    const dialogWindowName = useSelector(getToolbarDialog, shallowEqual);
    const props = {
        onHide: () => SentDispatchEventWhenToolbarItemIsChanges(dispatch, ToolsConstants.ToolsNames.SelectBox),
        editor,
    };

    const Tool = GetToolbarByName(dialogWindowName);
    if (Tool && isDialogToolbarItem(Tool)) {
        return <Tool.DialogRender {...props} />;
    }
    return null;
}
