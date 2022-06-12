import { useAppDispatch, useAppSelector } from "@app/hooks";
import { getToolbarFrequentAtoms, getToolbarItemContext } from "@app/selectors";
import { Direction } from "@constants/enum.constants";
import { ToolbarAction } from "@src/types";
import IconByName from "@styles/icons";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    ActiveToolbarItem,
    DialogToolbarItem,
    isDialogToolbarItem,
    ToolbarItem,
    ToolbarItemButton,
} from "./ToolbarItem";
import { actions } from "./toolbarItemsSlice";
import { generateAtomsButtons } from "./tools";
import { GetToolbarByName } from "./tools/ToolsMapper.helper";
import { SentDispatchEventWhenToolbarItemIsChanges } from "./ToolsButtonMapper.helper";

interface IToolbarItemsProps {
    toolbarItemsList: ToolbarItemButton[];
    direction: Direction;
    // eslint-disable-next-line react/require-default-props
    className?: string;
}

type Props = IToolbarItemsProps;

export function ToolbarItems(props: Props) {
    const dispatch = useAppDispatch();
    const { toolbarItemsList, direction } = props;

    let modifiedToolbarItemsList = toolbarItemsList;

    let { className } = props;
    className = className ?? "";
    const directionLower = Direction[direction].toLowerCase();
    const thisClassName: string = `toolbar-${directionLower}`;

    const currentToolbarContext = useSelector(getToolbarItemContext);
    const frequentAtoms = useSelector(getToolbarFrequentAtoms);

    // programmly add the frequent atoms to the toolbar
    if (direction === Direction.Right) {
        const frequentAtomsButtons = generateAtomsButtons(frequentAtoms.atoms);
        modifiedToolbarItemsList = [...modifiedToolbarItemsList, ...frequentAtomsButtons];
    }

    const currentToolbarName = currentToolbarContext.subToolName ?? currentToolbarContext?.toolName;

    const onToolbarClick = (event: React.MouseEvent<HTMLButtonElement>, toolbarItem: ToolbarItemButton) => {
        event.stopPropagation();
        SentDispatchEventWhenToolbarItemIsChanges(dispatch, toolbarItem.subToolName ?? toolbarItem.toolName);

        // const tool = GetToolbarByName(toolbarItem.toolName);
        // const buttonHtml = event.currentTarget;

        // // remove the active class from the previous active toolbar item
        // document.querySelectorAll(`.${styles.toolbar_icon_button_active}`).forEach((button) => {
        //     button.classList.remove(styles.toolbar_icon_button_active);
        //     button.removeAttribute("selected");
        // });

        // if (!tool) {
        //     console.log(`ToolbarItem: ${toolbarItem.toolName} not found`);
        //     return;
        // }
        // buttonHtml.classList.add(styles.toolbar_icon_button_active);
        // buttonHtml.setAttribute("selected", "true");

        // if (isDialogToolbarItem(tool)) {
        //     dispatch(actions.dialog(toolbarItem.toolName));
        // } else {
        //     const payload: ToolbarAction = {
        //         toolName: toolbarItem.toolName,
        //     };
        //     const { attributes, subToolName } = toolbarItem;
        //     if (attributes) payload.attributes = attributes;
        //     if (subToolName) payload.subToolName = subToolName;

        //     dispatch(actions.tool_change(payload));
        // }
    };

    return (
        <div className={clsx(styles[thisClassName], thisClassName, styles[className])}>
            {modifiedToolbarItemsList.map((item) => {
                const name = item.subToolName ?? item.toolName;
                const isActive = currentToolbarName === name;
                const activeClass = isActive ? styles.toolbar_icon_button_active : "";
                return (
                    <button
                        type="button"
                        // className={styles.button}
                        onClick={(e) => onToolbarClick(e, item)}
                        key={name}
                        aria-label={name}
                        title={name}
                        className={clsx(
                            styles.toolbar_icon_button,
                            styles[`toolbar_icon_button_${directionLower}`],
                            activeClass
                        )}
                    >
                        {IconByName(item)}
                    </button>
                );
            })}
        </div>
    );
}

export type { IToolbarItemsProps };
