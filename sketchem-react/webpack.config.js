const path = require("path");
const webpack = require("webpack"); // for development only?
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "./src/index.tsx"),
    mode: "development",
    devtool: "source-map",
    module: {
        rules: [
            // {
            //     test: /\.(js|jsx)$/,
            //     exclude: /node_modules/,
            //     use: ['babel-loader'],
            // },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(csv|tsv)$/i,
                use: ["csv-loader"],
            },
            {
                test: /\.xml$/i,
                use: ["xml-loader"],
            },
            {
                test: /\.(j|t)s(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
            // {
            //     test: /\.ts(x?)$/,
            //     exclude: /node_modules/,
            //     use: [
            //         {
            //             loader: 'ts-loader',
            //         },
            //     ],
            // },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        plugins: [
            new TsconfigPathsPlugin({
                // configFile: './tsconfig.json',
                configFile: path.resolve(__dirname, "./tsconfig.json"),
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            }),
        ],
        fallback: {
            // for indigo node.js incomplete module
            fs: false,
        },
        // extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            "@app/*": path.resolve(__dirname, "./src/app"),
            // "@app/*": ["./src/app/*"],
            // '@app/hooks': path.resolve(__dirname, './src/app/hooks'),
        },
        // alias: {
        //     '@src': path.resolve('./src'),
        //     '@app': path.resolve('./src/app'),
        //     '@constants': path.resolve('./src/_constants'),
        // },
        // alias: {
        //     '@src': path.resolve(__dirname, 'src'),
        //     '@app': path.resolve(__dirname, 'src/app'),
        //     '@constants': path.resolve(__dirname, 'src/_constants'),
        // },
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
    },
};
