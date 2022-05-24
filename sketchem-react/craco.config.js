const path = require("path");
// const CopyPlugin = require("copy-webpack-plugin");
// const webpack = require("webpack"); // for development only?

module.exports = {
    webpack: {
        alias: {
            "@app": path.resolve(__dirname, "src/app"),
            "@constants": path.resolve(__dirname, "src/constants"),
            "@entities": path.resolve(__dirname, "src/entities/index.ts"),
            "@features": path.resolve(__dirname, "src/features"),
            "@src": path.resolve(__dirname, "src"),
            "@styles": path.resolve(__dirname, "src/styles"),
            "@types": path.resolve(__dirname, "src/types/index.ts"),
            "@utils": path.resolve(__dirname, "src/utils"),
        },
        // rules: [{ test: /\.wasm$/, type: "asset/inline" }],
        configure: {
            resolve: {
                fallback: {
                    fs: false,
                    path: require.resolve("path-browserify"),
                },
            },
        },
        // plugins: [
        //     // Copy kekule extra folder
        //     new CopyPlugin({
        //         patterns: [
        //             // { from: path.resolve(__dirname, "src", "utils", "kekule-js-dist", "extra"), to: "static/js/extra" },
        //             { from: path.resolve(__dirname, "src", "utils", "kekule-js-dist"), to: "static/js/kekule-js-dist" },
        //         ],
        //     }),
        // ],
    },
};
