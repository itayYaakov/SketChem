import { useAppDispatch, useAppSelector } from "@app/hooks";
import { Direction } from "@constants/enum.constants";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import type ToolbarItem from "./ToolbarItem";
import { actions } from "./toolbarItemsSlice";

// eslint-disable-next-line no-restricted-syntax
for (const [key, value] of Object.entries(styles)) {
    console.log(`${key}: ${value}`);
}

// handleEvent = (event) => {
//     if (event.type === "mousedown") {
//            this.setState({ message: "Mouse Down"});
//        } else {
//            this.setState({ message: "Mouse Up"});
//        }
//    }

// true === event.ctrlKey && 'b' === event.key (to detect ctrl+b)
interface IToolbarItemsProps {
    toolbarItemsList: ToolbarItem[];
    direction: Direction;
}

type Props = IToolbarItemsProps;

export function ToolbarItems(props: Props) {
    // const count = useAppSelector(selectCount);
    const dispatch = useAppDispatch();
    const { toolbarItemsList } = props;
    const { direction } = props;
    const className: string = `toolbar-${Direction[direction].toLowerCase()}`;
    // const className: string = Direction[direction].toLowerCase();
    // const className: string = `toolbar_${DirectionString[direction]}`;

    // const [activeToolbarItem, setActiveToolbarItem] = useState('')

    const onToolbarClick = (event: React.MouseEvent<HTMLButtonElement>, toolbarItem: ToolbarItem) => {
        const button: HTMLButtonElement = event.currentTarget;
        dispatch(actions.press(toolbarItem.name));
        // setActiveToolbarItem(toolbarItem.name);

        toolbarItem.onButtonClick?.(event);

        event.stopPropagation();
    };

    // useEffect(() => {
    //     // Do something on each new render
    //     console.log("render");
    // });
    return (
        <div className={clsx(styles[className], className)}>
            {/* <div> */}
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
