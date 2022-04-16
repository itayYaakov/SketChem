import React from "react";
import { ToolbarItems } from "@features/toolbar-item/ToolbarItems";

import b from "@features/toolbar-item/bottom-toolbar-item/ToolbarItem";
import l from "@features/toolbar-item/left-toolbar-item/ToolbarItem";
import r from "@features/toolbar-item/right-toolbar-item/ToolbarItem";
import t from "@features/toolbar-item/top-toolbar-item/ToolbarItem";

import logo from "./logo.svg";
// import { Counter } from './features/counter/Counter';
import "./App.css";

function App() {
    // if (loading) {
    //   return <AppLoading />;
    // }

    return (
        <>
            <header>Sketchem App</header>
            <div className="App">
                <ToolbarItems {...b} />
                <ToolbarItems {...r} />
                <ToolbarItems {...l} />
                <ToolbarItems {...t} />
            </div>
        </>
    );
}

export default App;
