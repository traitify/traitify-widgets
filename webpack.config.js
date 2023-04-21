const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = (_env) => {
  const env = _env || {};
  const environment = process.env.NODE_ENV || "development";
  const cssMaps = environment !== "production";
  let config = {
    context: path.resolve(__dirname, "src"),
    devServer: {
      client: {
        overlay: {errors: true, warnings: false}
      },
      devMiddleware: {
        publicPath: "/build/"
      }
    },
    devtool: "source-map",
    externals : {
      "react": "react",
      "react-dom": "react-dom"
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
              options:  {
                sourceMap: cssMaps,
                modules: {
                  localIdentName: "traitify--[path]--[local]"
                },
                importLoaders: 2,
              }
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: ["autoprefixer"]
                },
                sourceMap: cssMaps,
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
    optimization: {
      splitChunks: {
        chunks: "initial"
      }
    },
    plugins: [
      new ESLintPlugin({emitWarning: true, extensions: ["js", "jsx"], failOnError: false}),
      new webpack.ProvidePlugin({"React": "react"}),
      new webpack.DefinePlugin({
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

  const browser = env.mode === "browser";

  if(browser){
    delete config.externals;

    config.entry = [
      "regenerator-runtime/runtime",
      "core-js/stable",
      "./index.js",
    ];
    config.output = {
      clean: true,
      filename: "traitify.js",
      globalObject: "this",
      library: {
        export: "default",
        name: "Traitify",
        type: "umd",
        umdNamedDefine: true
      },
      path: path.resolve(__dirname, "build"),
      publicPath: "/"
    };
  } else {
    config.entry = {
      hooks: "./hooks.js",
      traitify: "./index.js"
    };
    config.output = {
      clean: true,
      filename: "[name].js",
      path: path.resolve(__dirname, "build"),
      publicPath: "/"
    };
  }

  return config;
};
