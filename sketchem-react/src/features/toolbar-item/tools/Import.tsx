import { useAppDispatch } from "@app/hooks";
import * as ToolsConstants from "@constants/tools.constants";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import SelectSearch from "react-select-search";

import { DialogToolbarItem, ToolbarItemButton } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

let isLibsEnabled = false;

function SupportedFiles(props: any) {
    /**
     * The options array should contain objects.
     * Required keys are "name" and "value" but you can have and use any number of key/value pairs.
     */
    const { selectOptions, initialFormat, onFormatChange } = props;

    return (
        //
        <Form.Select value={initialFormat} onChange={(e: any) => onFormatChange(e.target.value)}>
            {selectOptions.map((element: any) => (
                <option value={element.value} key={element.value}>
                    {element.name}
                </option>
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
    const [format, setFormat] = useState("mol");
    console.log(format);

    const dispatch = useAppDispatch();

    const inputRef = React.createRef<HTMLTextAreaElement>();

    const loadText = () => {
        console.log("Print text");
        const textValue = inputRef?.current?.value;
        if (!textValue) return;
        console.log(textValue);
        const payload = {
            content: textValue,
            format,
            replace: true,
        };
        dispatch(actions.loadFile(payload));
        onHide();
    };

    // !!!! find a better place
    useEffect(() => {
        if (isLibsEnabled) return;
        KekuleUtils.enableBabel();
        KekuleUtils.enableIndigo();
        isLibsEnabled = true;
    }, []);
    const options = KekuleUtils.getSupportedReadFormats();

    return (
        <>
            <Modal.Body className="show-grid">
                <Container fluid>
                    <Row>
                        <SupportedFiles selectOptions={options} onFormatChange={setFormat} initialFormat={format} />
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

class ImportToolBarTemplate implements DialogToolbarItem {
    name: string;

    keyboardKeys?: string[];

    DialogRender: (props: any) => JSX.Element;

    constructor(name: string, onToolClick: (props: any) => JSX.Element, keyboardKeys?: string[]) {
        this.name = name;
        this.keyboardKeys = keyboardKeys ?? undefined;
        this.DialogRender = onToolClick;
    }
}

RegisterToolbarWithName(ToolsConstants.ToolsNames.Import, {
    DialogRender: DialogLoadWindow,
});

const Import: ToolbarItemButton = {
    name: "Import",
    toolName: ToolsConstants.ToolsNames.Import,
    keyboardKeys: ["D"],
};

RegisterToolbarButtonWithName(Import);

export default Import;