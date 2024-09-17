const ESLintPlugin = require("eslint-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = ({env, name}) => {
  const environment = process.env.NODE_ENV || "development";
  const cssMaps = environment !== "production";
  const config = {
    context: path.resolve(__dirname, name),
    devServer: {
      client: {
        overlay: false
      },
      devMiddleware: {
        publicPath: "/build/"
      }
    },
    devtool: "source-map",
    entry: {[name]: `./index.js`},
    externals: {
      "react": {
        amd: "react",
        commonjs: "react",
        commonjs2: "react",
        root: "React"
      },
      "react-dom": {
        amd: "react-dom",
        commonjs: "react-dom",
        commonjs2: "react-dom",
        root: "ReactDOM"
      }
    },
    mode: environment,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.(scss|css)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "style-loader",
              options: {
                injectType: "singletonStyleTag"
              }
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: cssMaps,
                modules: {
                  localIdentName: "traitify--[path]--[local]",
                  namedExport: false
                },
                importLoaders: 2
              }
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: ["autoprefixer"]
                },
                sourceMap: cssMaps
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: cssMaps
              }
            }
          ]
        },
        {
          test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
          type: "asset/resource"
        }
      ]
    },
    output: {
      clean: true,
      filename: `${name}.js`,
      globalObject: "this",
      library: {
        name: "RJP",
        type: "umd",
        umdNamedDefine: true
      },
      path: path.resolve(__dirname, `${name}/build`),
      publicPath: "/"
    },
    plugins: [
      new ESLintPlugin({
        context: path.resolve(__dirname, name),
        eslintPath: "../../eslint",
        emitWarning: true,
        failOnError: false
      }),
      new webpack.ProvidePlugin({React: "react"}),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(process.env.npm_package_version)
      })
    ],
    resolve: {
      alias: {
        traitify: path.resolve(__dirname, "../src")
      },
      extensions: [".js"],
      modules: [
        path.resolve(__dirname, `${name}/src`),
        path.resolve(__dirname, `${name}/node_modules`)
      ]
    }
  };

  const browser = env.platform === "browser";

  if(browser) {
    delete config.externals;

    config.entry = [
      "regenerator-runtime/runtime",
      "core-js/stable",
      "./index.js"
    ];
    config.output.clean = false;
    config.output.library.export = "default";
  }

  return config;
};
