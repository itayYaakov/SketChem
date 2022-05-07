import { useAppDispatch } from "@app/hooks";
import { getToolbarItem } from "@app/selectors";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

import { actions } from "./toolbarItemsSlice";
import { Import } from "./tools";

export function DialogShow() {
    const dispatch = useAppDispatch();
    const dialogWindowName = useSelector(getToolbarItem).dialogWindow;
    const props = {
        onHide: () => dispatch(actions.dialog("")),
    };
    switch (dialogWindowName) {
        case Import.name:
            return <Import.DialogRender {...props} />;
            break;

        default:
            return null;
    }
}
