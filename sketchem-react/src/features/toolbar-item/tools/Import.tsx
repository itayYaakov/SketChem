import { useAppDispatch } from "@app/hooks";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import SelectSearch from "react-select-search";

import { DummyToolbarItem } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";

function SupportedFiles(props: any) {
    /**
     * The options array should contain objects.
     * Required keys are "name" and "value" but you can have and use any number of key/value pairs.
     */
    const { selectOptions } = props;

    return (
        //
        <Form.Select aria-label="Default select example">
            {selectOptions.map((element: any) => (
                <option value={element.value}>{element.name}</option>
            ))}
        </Form.Select>
        // <SelectSearch
        //     //
        //     options={selectOptions}
        //     search
        //     placeholder="Select import file extension"
        // />
    );
}

function ImportFileTab(props: any) {
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

    KekuleUtils.enableBabel();
    const options = KekuleUtils.getSupportedReadFormats();

    return (
        <>
            <Modal.Body className="show-grid">
                <Container fluid>
                    <Row>
                        <SupportedFiles selectOptions={options} />
                    </Row>
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
            dialogClassName={clsx(styles.import_dialog, "stupid_Test")}
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
                    <ImportFileTab onHide={hideMe} title="From Paste" />
                </Tab>
                <Tab eventKey="file" title="From file">
                    <ImportFileTab onHide={hideMe} title="From file" />
                </Tab>
            </Tabs>
        </Modal>
    );
}

class ImportToolBarTemplate implements DummyToolbarItem {
    name: string;

    keyboardKeys?: string[];

    DialogRender: (props: any) => JSX.Element;

    constructor(name: string, onToolClick: (props: any) => JSX.Element, keyboardKeys?: string[]) {
        this.name = name;
        this.keyboardKeys = keyboardKeys ?? undefined;
        this.DialogRender = onToolClick;
    }
}

const Import = new ImportToolBarTemplate("Import", DialogLoadWindow, ["D"]);

export default Import;
