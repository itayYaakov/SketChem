import "@styles/App.scss";

import { KekuleShow } from "@features/chemistry/kekuleHandler";
import SketchPad from "@features/sketchpad/SketchPad";
import {
    BottomToolbarProps,
    DialogShow,
    LeftToolbarProps,
    RightToolbarProps,
    ToolbarItems,
    TopToolbarProps,
} from "@features/toolbar-item";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import ButtonsShowcase from "./buttons";
import logo from "./logo.svg";

function App() {
    // if (loading) {
    //   return <AppLoading />;
    // }

    return (
        <>
            <header>Sketchem App</header>
            <div className="App">
                {/* <Container className="p-3">
                    <Container className="p-5 mb-4 bg-light rounded-3">
                        <h1 className="header">Welcome To React-Bootstrap TypeScript Example</h1>
                    </Container>
                    <h2>Buttons</h2>
                    <ButtonsShowcase />
                </Container> */}
                {/* delete later */}
                <KekuleShow />
                {/* delete later */}
                <Container fluid>
                    <Row>
                        <Col>
                            <ToolbarItems {...TopToolbarProps} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl="1">
                            <ToolbarItems {...LeftToolbarProps} />
                        </Col>
                        <Col xl="10">
                            <Row className="h-50">
                                <SketchPad />
                            </Row>
                        </Col>
                        <Col xl="1">
                            <ToolbarItems {...RightToolbarProps} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ToolbarItems {...BottomToolbarProps} />
                        </Col>
                    </Row>
                    <DialogShow />
                </Container>
            </div>
        </>
    );
}

export default App;
