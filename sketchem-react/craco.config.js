const path = require("path");
// const webpack = require("webpack"); // for development only?
// const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    webpack: {
        alias: {
            "@src": path.resolve(__dirname, "src"),
            "@app": path.resolve(__dirname, "src/app"),
            "@styles": path.resolve(__dirname, "src/styles"),
            "@constants": path.resolve(__dirname, "src/_constants"),
            "@features": path.resolve(__dirname, "src/features"),
        },
    },
};
