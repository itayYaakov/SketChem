import { useAppDispatch } from "@app/hooks";
import { ToolsConstants } from "@constants/tools.constants";
import { actions } from "@features/toolbar-item/toolbarItemsSlice";
import { IAtomAttributes, ToolbarAction } from "@src/types";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";

import { DialogToolbarItem, ToolbarItemButton } from "../../ToolbarItem";
import { RegisterToolbarWithName } from "../ToolsMapper.helper";
// import { actions } from "../toolbarItemsSlice";
import PeriodicTable from "./PeriodicTable";

export function PeriodicTableWindow(props: any) {
    const [modalShow, setModalShow] = useState(true);
    const dispatch = useAppDispatch();
    const { onHide } = props;

    console.log("preiodc table windows ");
    const hideMe = () => {
        setModalShow(false);
        onHide();
    };

    const onAtomClick = (atomLabel: string) => {
        const attributes: IAtomAttributes = {
            label: atomLabel,
            color: "red",
        };
        const payload: ToolbarAction = {
            button: ToolsConstants.ToolsNames.Atom,
            attributes,
        };
        dispatch(actions.tool_change(payload));
    };

    return (
        <Modal
            show={modalShow}
            // size="xl"
            contentClassName={clsx(styles.dialog_tab)}
            dialogClassName={clsx(styles.dialog_window)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <div>
                <PeriodicTable onAtomClick={onAtomClick} />
                <Button className="m-2" onClick={hideMe}>
                    Close
                </Button>
            </div>
        </Modal>
    );
}

class PeriodicTableToolbarItem implements DialogToolbarItem {
    name: string;

    keyboardKeys?: string[];

    DialogRender: (props: any) => JSX.Element;

    constructor(name: string, onToolClick: (props: any) => JSX.Element, keyboardKeys?: string[]) {
        this.name = name;
        this.keyboardKeys = keyboardKeys ?? undefined;
        this.DialogRender = onToolClick;
    }
}

RegisterToolbarWithName(ToolsConstants.ToolsNames.PeriodicTable, {
    DialogRender: PeriodicTableWindow,
});

const PeriodicTableTool: ToolbarItemButton = {
    name: "Periodic Table",
    toolName: ToolsConstants.ToolsNames.PeriodicTable,
    keyboardKeys: ["D"],
};

export default PeriodicTableTool;
