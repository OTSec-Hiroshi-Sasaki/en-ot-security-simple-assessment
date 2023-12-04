const Webpack = require('webpack');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const enabledSourceMap = process.env.NODE_ENV !== "production";
const { VueLoaderPlugin } = require('vue-loader');

module.exports = env => {
    const mode = env.hasOwnProperty('WEBPACK_BUILD') ? 'production' : 'development';

    return {
        entry: path.resolve(__dirname, "_src/index.js"),

        output: {
            path: path.resolve(__dirname, "deploy/"),
            filename: `js/script.js`
        },

        devServer: {
            static: {
                directory: path.resolve(__dirname, 'deploy/'),
            },
            open: true,
            hot: true,
            port: 3000,
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@babel/preset-env'
                                ]
                            }
                        }
                    ],
                    exclude: /node_modules/,
                },

                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },

                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,

                        {
                            loader: "css-loader",
                            options: {
                                url: false,
                                sourceMap: enabledSourceMap,
                                importLoaders: 2
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: enabledSourceMap,
                                postcssOptions: {
                                    plugins: [require("autoprefixer")({ grid: true })]
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                implementation: require("sass"),
                                sourceMap: enabledSourceMap
                            }
                        }
                    ]
                }
            ]
        },
        target: ["web", "es5"],
        resolve: {
            alias: {
                vue$: 'vue/dist/vue.esm-bundler.js',
                extensions: [ '.ts', '.js', '.vue', '.json' ]
            },
        },
        plugins: [
            new Webpack.DefinePlugin({ __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: true }),
            new MiniCssExtractPlugin({
                filename: `css/style.css`
            }),
            new VueLoaderPlugin(),
        ]
    }
}