import "./index.css";

import React from "react";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./app/store";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            {/* breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]} */}
            {/* !!! only xl for now */}
            <ThemeProvider breakpoints={["xl"]}>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
