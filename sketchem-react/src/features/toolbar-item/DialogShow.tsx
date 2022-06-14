/* eslint-disable react/jsx-pascal-case */
import { useAppDispatch } from "@app/hooks";
import { getToolbarDialog } from "@app/selectors";
import * as ToolsConstants from "@constants/tools.constants";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

import { isDialogToolbarItem } from "./ToolbarItem";
import { GetToolbarByName } from "./tools/ToolsMapper.helper";
import { SentDispatchEventWhenToolbarItemIsChanges } from "./ToolsButtonMapper.helper";

export function DialogShow() {
    const dispatch = useAppDispatch();
    const dialogWindowName = useSelector(getToolbarDialog, shallowEqual);
    const props = {
        onHide: () => SentDispatchEventWhenToolbarItemIsChanges(dispatch, ToolsConstants.ToolsNames.SelectBox),
    };
    console.log(dialogWindowName);
    const tool = GetToolbarByName(dialogWindowName);
    if (tool && isDialogToolbarItem(tool)) {
        return <tool.DialogRender {...props} />;
    }
    return null;
}
