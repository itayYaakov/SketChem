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
        // onHide: () => dispatch(actions.dialog("")),
        onHide: () => SentDispatchEventWhenToolbarItemIsChanges(dispatch, ToolsConstants.ToolsNames.SelectBox),
    };
    console.log(dialogWindowName);
    const tool = GetToolbarByName(dialogWindowName);
    if (tool && isDialogToolbarItem(tool)) {
        return <tool.DialogRender {...props} />;
    }
    return null;
    // let Renderer = null;
    // switch (dialogWindowName) {
    //     case Import.name:
    //         Renderer = (Import.tool as DialogToolbarItem).DialogRender;
    //         break;
    //     case PeriodicTableTool.name:
    //         Renderer = (PeriodicTableTool.tool as DialogToolbarItem).DialogRender;
    //         break;

    //     default:
    //         return null;
    // }

    // if (!Renderer) return null;
    // return <Renderer {...props} />;
}
