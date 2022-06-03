import { useAppDispatch, useAppSelector } from "@app/hooks";
import { Direction } from "@constants/enum.constants";
import { ToolbarAction } from "@src/types";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
    ActiveToolbarItem,
    DialogToolbarItem,
    isDialogToolbarItem,
    ToolbarItem,
    ToolbarItemButton,
} from "./ToolbarItem";
import { actions } from "./toolbarItemsSlice";
import { GetToolbarByName } from "./tools/ToolsMapper.helper";

// eslint-disable-next-line no-restricted-syntax
// for (const [key, value] of Object.entries(styles)) {
//     console.log(`${key}: ${value}`);
// }

// handleEvent = (event) => {
//     if (event.type === "mousedown") {
//            this.setState({ message: "Mouse Down"});
//        } else {
//            this.setState({ message: "Mouse Up"});
//        }
//    }

// true === event.ctrlKey && 'b' === event.key (to detect ctrl+b)
interface IToolbarItemsProps {
    toolbarItemsList: ToolbarItemButton[];
    direction: Direction;
    // eslint-disable-next-line react/require-default-props
    className?: string;
}

type Props = IToolbarItemsProps;

export function ToolbarItems(props: Props) {
    const dispatch = useAppDispatch();
    const { toolbarItemsList } = props;
    const { direction } = props;
    let { className } = props;
    className = className ?? "";
    const thisClassName: string = `toolbar-${Direction[direction].toLowerCase()}`;

    // const [activeToolbarItem, setActiveToolbarItem] = useState('')

    const onToolbarClick = (event: React.MouseEvent<HTMLButtonElement>, toolbarItem: ToolbarItemButton) => {
        event.stopPropagation();
        const tool = GetToolbarByName(toolbarItem.toolName);

        if (!tool) {
            console.log(`ToolbarItem: ${toolbarItem.toolName} not found`);
        } else if (isDialogToolbarItem(tool)) {
            dispatch(actions.dialog(toolbarItem.toolName));
        } else {
            const payload: ToolbarAction = {
                button: toolbarItem.toolName,
            };
            const { attributes } = toolbarItem;
            if (attributes) payload.attributes = attributes;
            dispatch(actions.tool_change(payload));
        }
        // const button: HTMLButtonElement = event.currentTarget;
        // setActiveToolbarItem(toolbarItem.name);
        // toolbarItem.onButtonClick?.(event);
    };

    return (
        <div className={clsx(styles[thisClassName], thisClassName, styles[className])}>
            {toolbarItemsList.map((item) => (
                <button
                    type="button"
                    // className={styles.button}
                    onClick={(e) => onToolbarClick(e, item)}
                    key={item.name}
                >
                    {item.name} Button
                </button>
            ))}
        </div>
    );
}

export type { IToolbarItemsProps };
