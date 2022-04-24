// import { Counter } from './features/counter/Counter';
import "@styles/App.scss";

// import SketchPad from "@features/sketchpad/hooks/only_for_reference/SketchPadRaphael";
import SketchPad from "@features/sketchpad/SketchPad";
import b from "@features/toolbar-item/bottom-toolbar-item/ToolbarItem";
import l from "@features/toolbar-item/left-toolbar-item/ToolbarItem";
import r from "@features/toolbar-item/right-toolbar-item/ToolbarItem";
import { ToolbarItems } from "@features/toolbar-item/ToolbarItems";
import t from "@features/toolbar-item/top-toolbar-item/ToolbarItem";
import React from "react";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
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
                <Container fluid>
                    <Row>
                        <Col>
                            <ToolbarItems {...t} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl="1">
                            <ToolbarItems {...l} />
                        </Col>
                        <Col xl="10">
                            <SketchPad />
                        </Col>
                        <Col xl="1">
                            <ToolbarItems {...r} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ToolbarItems {...b} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default App;
