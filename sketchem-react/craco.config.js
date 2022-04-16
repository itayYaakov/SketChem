const path = require("path");
const webpack = require("webpack"); // for development only?
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    webpack: {
        alias: {
            "@src": path.resolve(__dirname, "src"),
            "@app": path.resolve(__dirname, "src/app"),
            "@constants": path.resolve(__dirname, "src/_constants"),
            "@features": path.resolve(__dirname, "src/features"),
        },
        // resolve: {
        //     plugins: [
        //         new TsconfigPathsPlugin({
        //             configFile: "./tsconfig.json",
        //             // configFile: path.resolve(__dirname, "./tsconfig.json"),
        //             extensions: [".js", ".jsx", ".ts", ".tsx"],
        //         }),
        //     ],
        // },
        // resolve: {
        //     plugins: [
        //         new TsconfigPathsPlugin({
        //             configFile: "./tsconfig.json",
        //             // configFile: path.resolve(__dirname, "./tsconfig.json"),
        //             extensions: [".js", ".jsx", ".ts", ".tsx"],
        //         }),
        //     ],
        // },
    },
};
