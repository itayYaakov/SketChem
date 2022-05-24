import { useAppDispatch } from "@app/hooks";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useState } from "react";
import { Button, Col, Container, Modal, Row, Tab, Tabs } from "react-bootstrap";

import { DummyToolbarItem } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";

function ExportFileTab(props: any) {
    const { onHide, title } = props;
    const dispatch = useAppDispatch();

    const inputRef = React.createRef<HTMLTextAreaElement>();

    const loadText = () => {
        console.log("Print text");
        const textValue = inputRef?.current?.value;
        if (!textValue) return;
        console.log(textValue);
        const payload = {
            content: textValue,
            format: "mol",
            replace: true,
        };
        dispatch(actions.load_file(payload));
        onHide();
    };

    return (
        <>
            <Modal.Body className="show-grid">
                <Container fluid>
                    <Row>
                        <Col>
                            <textarea
                                ref={inputRef}
                                rows={12}
                                className="w-100"
                                placeholder="Paste content of any file (from the supported formats)"
                            />
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <div className="me-auto">
                    {/* Todo!! actually replace or add the molecule on the canvas */}
                    <Button className="m-2" onClick={loadText}>
                        Replace
                    </Button>
                    <Button className="m-2" onClick={loadText}>
                        Add
                    </Button>
                </div>
                <Button className="m-2" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </>
    );
}

const defaultTab = "paste";

export function DialogLoadWindow(props: any) {
    const [modalShow, setModalShow] = useState(true);
    const [key, setKey] = useState(defaultTab);
    const { onHide } = props;

    const hideMe = () => {
        setModalShow(false);
        onHide();
    };

    return (
        // <Modal {...props} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal
            show={modalShow}
            // size="xl"
            dialogClassName={clsx(styles.export_dialog, "stupid_Test")}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k ?? defaultTab)}
                className="mb-3"
            >
                <Tab eventKey="paste" title="From Paste">
                    <ExportFileTab onHide={hideMe} title="From Paste" />
                </Tab>
                <Tab eventKey="file" title="From file">
                    <ExportFileTab onHide={hideMe} title="From file" />
                </Tab>
            </Tabs>
        </Modal>
    );
}

class ExportToolBarTemplate implements DummyToolbarItem {
    name: string;

    keyboardKeys?: string[];

    DialogRender: (props: any) => JSX.Element;

    constructor(name: string, onToolClick: (props: any) => JSX.Element, keyboardKeys?: string[]) {
        this.name = name;
        this.keyboardKeys = keyboardKeys ?? undefined;
        this.DialogRender = onToolClick;
    }
}

const Export = new ExportToolBarTemplate("Export", DialogLoadWindow, ["D"]);

export default Export;
