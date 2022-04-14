import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector, useAppDispatch } from "@app/hooks";
import { Direction } from "@constants/enum.constants";
import { actions } from "./toolbarItemsSlice";
import type ToolbarItem from "./ToolbarItem";

// !!! need to convert to less
import styles from "./Counter.module.css";

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

    // const [activeToolbarItem, setActiveToolbarItem] = useState('')

    const onToolbarClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        toolbarItem: ToolbarItem
    ) => {
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
        <div>
            {toolbarItemsList.map((item) => (
                <button
                    type="button"
                    // className={styles.button}
                    onClick={e => onToolbarClick(e, item)}
                    key={item.name}
                >
                    {item.name} Button
                </button>
            ))}
        </div>
    );
}

export type { IToolbarItemsProps };
