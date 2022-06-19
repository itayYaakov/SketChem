import * as ToolsConstants from "@constants/tools.constants";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import styles from "@styles/index.module.scss";
import { exportFileFromMolecule } from "@utils/KekuleUtils";
import clsx from "clsx";
import React, { useState } from "react";
import { Button, Container, Form, Modal, Row } from "react-bootstrap";

import { DialogProps, DialogToolbarItem, ToolbarItemButton } from "../ToolbarItem";
import { RegisterToolbarButtonWithName } from "../ToolsButtonMapper.helper";
import { RegisterToolbarWithName } from "./ToolsMapper.helper";

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

function ExportFile(props: DialogProps & { title: string }) {
    const { onHide, editor, title } = props;
    const [format, setFormat] = useState("mol");
    console.log(format);

    const loadText = (download: boolean) => {
        editor.updateAllKekuleNodes();
        const content = exportFileFromMolecule(format);
        if (download) {
            const blob = new Blob([content], { type: "text/plain" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `sketChem_mol.${format}`;
            link.click();
            window.URL.revokeObjectURL(url);
        } else {
            navigator.clipboard.writeText(content);
        }
        onHide();
    };

    const options = KekuleUtils.getSupportedWriteFormats();

    return (
        <>
            <Modal.Body className="show-grid">
                <Container fluid>
                    <Row>
                        <SupportedFiles selectOptions={options} onFormatChange={setFormat} initialFormat={format} />
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <div className="me-auto">
                    {/* Todo!! actually replace or add the molecule on the canvas */}
                    <Button className="m-2" onClick={() => loadText(true)}>
                        Download
                    </Button>
                    <Button className="m-2" onClick={() => loadText(false)}>
                        Copy
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

export function DialogLoadWindow(props: DialogProps) {
    const [modalShow, setModalShow] = useState(true);
    const [key, setKey] = useState(defaultTab);
    const { onHide, editor } = props;

    const hideMe = () => {
        setModalShow(false);
        onHide();
    };

    return (
        <Modal
            show={modalShow}
            // size="xl"
            dialogClassName={clsx(styles.export_dialog)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <ExportFile onHide={hideMe} editor={editor} title="From Paste" />
        </Modal>
    );
}

class ExportToolBarTemplate implements DialogToolbarItem {
    name: string;

    keyboardKeys?: string[];

    DialogRender: (props: DialogProps) => JSX.Element;

    constructor(name: string, onToolClick: (props: DialogProps) => JSX.Element, keyboardKeys?: string[]) {
        this.name = name;
        this.keyboardKeys = keyboardKeys ?? undefined;
        this.DialogRender = onToolClick;
    }
}

RegisterToolbarWithName(ToolsConstants.ToolsNames.Export, {
    DialogRender: DialogLoadWindow,
});

const Export: ToolbarItemButton = {
    name: "Export",
    toolName: ToolsConstants.ToolsNames.Export,
    keyboardKeys: ["D"],
};

RegisterToolbarButtonWithName(Export);

export default Export;
