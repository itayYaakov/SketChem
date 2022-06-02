/* eslint-disable react/jsx-pascal-case */
import { useAppDispatch } from "@app/hooks";
import { getToolbarItem } from "@app/selectors";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

import { DialogToolbarItem, isDialogToolbarItem } from "./ToolbarItem";
import { actions } from "./toolbarItemsSlice";
import { Import, PeriodicTableTool } from "./tools";
import { GetToolbarByName } from "./tools/ToolsMapper.helper";

export function DialogShow() {
    const dispatch = useAppDispatch();
    const dialogWindowName = useSelector(getToolbarItem, shallowEqual).dialogWindow;
    const props = {
        onHide: () => dispatch(actions.dialog("")),
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
