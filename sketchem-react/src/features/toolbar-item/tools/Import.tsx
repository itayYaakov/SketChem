import { useAppDispatch } from "@app/hooks";
import * as ToolsConstants from "@constants/tools.constants";
import { drawMol } from "@features/chemistry/kekuleHandler";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { Button, Col, Container, Form, FormLabel, Modal, Row, Tab, Tabs } from "react-bootstrap";

import { DialogProps, ToolbarItemButton } from "../ToolbarItem";
import { actions } from "../toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

// eslint-disable-next-line react/no-unused-prop-types, @typescript-eslint/no-unused-vars, no-unused-vars
function ImportFileTab(props: DialogProps & { title: string }) {
    const { onHide, editor } = props;
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const accepts = KekuleUtils.getSupportedReadFormats();
    const myId = "uploadButtonImport";

    const handleUpload = () => {
        inputRef.current?.click();
        console.log("Finally selected");
    };

    const loadText = (replace: boolean) => {
        console.log("replace=", replace);
        if (!inputRef.current?.files) return;
        if (replace) {
            editor.clear();
        }
        const file = inputRef.current?.files[0];
        KekuleUtils.loadFileData(file, (mol: any, success: boolean) => {
            if (success && mol) {
                drawMol(mol);
                editor.createHistoryUpdate();
            }
            onHide();
        });
    };

    const handleDisplayFileDetails = (file: File | undefined) => {
        if (!file) return;
        setUploadedFileName(file.name);
    };

    return (
        <>
            <Modal.Body className="show-grid">
                <Container fluid>
                    <Row>
                        <Col>
                            <FormLabel htmlFor={myId}>Choose file:</FormLabel>
                            <input
                                ref={inputRef}
                                id={myId}
                                accept={accepts}
                                onChange={(e) => handleDisplayFileDetails(e.target.files?.[0])}
                                className="d-none"
                                type="file"
                                hidden
                            />
                        </Col>
                        <Col>
                            <Button
                                role="button"
                                onClick={handleUpload}
                                className={uploadedFileName ? styles.buttons_green : styles.button_ok}
                            >
                                {uploadedFileName || "Upload"}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <div className="me-auto">
                    {/* Todo!! actually replace or add the molecule on the canvas */}
                    <Button className="m-2" onClick={() => loadText(true)}>
                        Replace
                    </Button>
                    <Button className="m-2" onClick={() => loadText(false)}>
                        Add
                    </Button>
                </div>
                <Button className={clsx("m-2", styles.buttons_close)} onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </>
    );
}

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
    );
}
// eslint-disable-next-line react/no-unused-prop-types, @typescript-eslint/no-unused-vars, no-unused-vars
function ImportTextTab(props: DialogProps & { title: string }) {
    const { onHide, editor } = props;
    const [format, setFormat] = useState("mol");
    console.log(format);

    const dispatch = useAppDispatch();

    const inputRef = React.createRef<HTMLTextAreaElement>();

    const loadText = (replace: boolean) => {
        const textValue = inputRef?.current?.value;
        if (!textValue) return;
        console.log(textValue);
        const payload = {
            content: textValue,
            format,
        };
        if (replace) {
            editor.clear();
        }
        dispatch(actions.loadFile(payload));
        editor.createHistoryUpdate();
        onHide();
    };

    const options = KekuleUtils.getSupportedReadFormatsOptions();

    return (
        <>
            <Modal.Body className="show-grid">
                <Container fluid>
                    <Row>
                        <SupportedFiles selectOptions={options} onFormatChange={setFormat} initialFormat={format} />
                    </Row>
                    <Row className="mt-2">
                        <textarea
                            ref={inputRef}
                            rows={12}
                            className="w-100"
                            placeholder="Paste content of any file (from the supported formats)"
                        />
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <div className="me-auto">
                    {/* Todo!! actually replace or add the molecule on the canvas */}
                    <Button className="m-2" onClick={() => loadText(true)}>
                        Replace
                    </Button>
                    <Button className="m-2" onClick={() => loadText(false)}>
                        Add
                    </Button>
                </div>
                <Button className={clsx("m-2", styles.buttons_close)} onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </>
    );
}

const defaultTab = "paste";

export function DialogLoadWindow(props: DialogProps) {
    const [modalShow, setModalShow] = useState(true);
    const [key, setKey] = useState(defaultTab);
    const { onHide, editor } = props;

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
                    <ImportTextTab onHide={hideMe} editor={editor} title="From Paste" />
                </Tab>
                <Tab eventKey="file" title="From file">
                    <ImportFileTab onHide={hideMe} editor={editor} title="From file" />
                </Tab>
            </Tabs>
        </Modal>
    );
}

RegisterToolbarWithName(ToolsConstants.ToolsNames.Import, {
    DialogRender: DialogLoadWindow,
});

const Import: ToolbarItemButton = {
    name: "Import",
    toolName: ToolsConstants.ToolsNames.Import,
    keyboardKeys: ToolsConstants.ToolsShortcutsMapByToolName.get(ToolsConstants.ToolsNames.Import),
};

RegisterToolbarButtonWithName(Import);

export default Import;
