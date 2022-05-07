/* eslint-disable class-methods-use-this */
import React, { useState } from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";

import { DummyToolbarItem } from "../ToolbarItem";

function MissedGoal() {
    return <h1>MISSED!</h1>;
}

function MadeGoal() {
    return <h1>Goal!</h1>;
}

export function DialogLoadWindow(props: any) {
    const [modalShow, setModalShow] = useState(true);
    const [key, setKey] = useState("home");
    const { onHide } = props;

    const hideMe = () => {
        setModalShow(false);
        onHide();
    };

    // function FromTextInput() {
    //     return (
    //         <>
    //             <h4>Centered Modal</h4>
    //             <p>
    //                 Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas
    //                 eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    //             </p>
    //         </>
    //     );
    // }

    return (
        // <Modal {...props} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal show={modalShow} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton onHide={onHide}>
                <Modal.Title id="contained-modal-title-vcenter">Import file</Modal.Title>
            </Modal.Header>
            {/* <Modal.Body className="show-grid"> */}
            <Modal.Body>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k ?? "home")}
                    className="mb-3"
                >
                    <Tab eventKey="home" title="Home">
                        <MissedGoal />
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                        <MadeGoal />
                    </Tab>
                    <Tab eventKey="contact" title="Contact" disabled>
                        {/* <FromTextInput /> */}
                    </Tab>
                </Tabs>
                {/* <h4>Centered Modal</h4>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas
                    eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                </p> */}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={hideMe}>Close</Button>
            </Modal.Footer>
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

// const loadFile = new LoadToolBarTemplate("Load file", ["D"]);
const Import = new ImportToolBarTemplate("Import", DialogLoadWindow, ["D"]);

export default Import;
