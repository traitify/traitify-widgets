const ESLintPlugin = require("eslint-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = (_env) => {
  const env = _env || {};
  const environment = process.env.NODE_ENV || "development";
  const browser = env.platform === "browser";
  const cssMaps = environment !== "production";
  const outputName = env.output || "traitify";
  const source = {"traitify": browser ? "cdn" : "npm"}[outputName] || outputName;
  const config = {
    context: path.resolve(__dirname, "src"),
    mode: environment,
    devServer: {
      client: {
        overlay: {errors: true, warnings: false}
      },
      devMiddleware: {
        publicPath: "/build/"
      }
    },
    devtool: "source-map",
    entry: ["./index.js"],
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
      filename: `${outputName}.js`,
      globalObject: "this",
      library: {
        name: "Traitify",
        type: "umd",
        umdNamedDefine: true
      },
      path: path.resolve(__dirname, "build"),
      publicPath: "/"
    },
    plugins: [
      new ESLintPlugin({emitWarning: true, failOnError: false}),
      new webpack.ProvidePlugin({React: "react"}),
      new webpack.DefinePlugin({
        SOURCE: JSON.stringify(source),
        VERSION: JSON.stringify(process.env.npm_package_version)
      })
    ],
    resolve: {
      extensions: [".jsx", ".js"],
      modules: [
        path.resolve(__dirname, "src"),
        path.resolve(__dirname, "node_modules")
      ],
      alias: {
        style: path.resolve(__dirname, "src/style")
      }
    }
  };

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
