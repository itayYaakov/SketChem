import { useAppDispatch } from "@app/hooks";
import {
    getToolbarFrequentAtoms,
    getToolbarItemContext,
    isChemistryRedoEnabled,
    isChemistryUndoEnabled,
} from "@app/selectors";
import { Direction } from "@constants/enum.constants";
import * as ToolsConstants from "@constants/tools.constants";
import IconByName from "@styles/icons";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import hotkeys from "hotkeys-js";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { ToolbarItemButton } from "./ToolbarItem";
import { generateAtomsButtons } from "./tools";
import { SentDispatchEventWhenToolbarItemIsChanges } from "./ToolsButtonMapper.helper";

interface IToolbarItemsProps {
    toolbarItemsList: ToolbarItemButton[];
    direction: Direction;
    // eslint-disable-next-line react/require-default-props
    className?: string;
}

type Props = IToolbarItemsProps;

function isUnredoDisabled(tool: ToolbarItemButton, undoDisabled: boolean, redoDisabled: boolean) {
    switch (tool.toolName) {
        case ToolsConstants.ToolsNames.Undo:
            // return pastLength === 0;
            return undoDisabled;
        case ToolsConstants.ToolsNames.Redo:
            // return futureLength === 0;
            return redoDisabled;
        default:
            return false;
    }
}

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
    const undoDisabled = !useSelector(isChemistryUndoEnabled);
    const redoDisabled = !useSelector(isChemistryRedoEnabled);

    // programmatically add the frequent atoms to the toolbar
    if (direction === Direction.Right) {
        const frequentAtomsButtons = generateAtomsButtons(frequentAtoms.atoms);
        modifiedToolbarItemsList = [...modifiedToolbarItemsList, ...frequentAtomsButtons];
    }

    const currentToolbarName = currentToolbarContext.subToolName ?? currentToolbarContext?.toolName;

    const onToolbarClick = (event: React.MouseEvent<HTMLButtonElement>, toolbarItem: ToolbarItemButton) => {
        event.stopPropagation();
        SentDispatchEventWhenToolbarItemIsChanges(dispatch, toolbarItem.subToolName ?? toolbarItem.toolName);
    };

    const setKeyboardPressEvent = (item: ToolbarItemButton) => {
        const disabled = isUnredoDisabled(item, undoDisabled, redoDisabled);
        if (!item.keyboardKeys || disabled) return;
        hotkeys(item.keyboardKeys, (event: any, handler: any) => {
            event.preventDefault();
            console.log(handler.key);
            if (!item.keyboardKeys) return;
            SentDispatchEventWhenToolbarItemIsChanges(
                dispatch,
                ToolsConstants.getNextToolByShortcut(item.keyboardKeys, currentToolbarName)
            );
        });
    };

    return (
        <div className={clsx(styles[thisClassName], thisClassName, styles[className])}>
            {modifiedToolbarItemsList.map((item) => {
                const name = item.subToolName ?? item.toolName;
                let title = item.name;
                if (item.keyboardKeys) title = `${item.name} (${item.keyboardKeys})`;
                const isActive = currentToolbarName === name;
                const activeClass = isActive ? styles.toolbar_icon_button_active : "";
                const disabled = isUnredoDisabled(item, undoDisabled, redoDisabled);
                if (!disabled) setKeyboardPressEvent(item);
                return (
                    <button
                        type="button"
                        onClick={(e) => onToolbarClick(e, item)}
                        key={name}
                        aria-label={title}
                        title={title}
                        disabled={disabled}
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
