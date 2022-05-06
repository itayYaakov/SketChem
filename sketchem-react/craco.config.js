const path = require("path");
// const webpack = require("webpack"); // for development only?
// const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

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
    },
};
