import path from "path";
import webpack from "webpack";

const env = process.env.NODE_ENV || "development";
const cssMaps = env !== "production";

let config = {
  context: path.resolve(__dirname, "src"),
  devServer: {
    publicPath: "/build/"
  },
  devtool: "source-map",
  entry: ["./index.js"],
  externals : {
    "react": {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom"
    }
  },
  mode: env,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
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
        type: 'asset/resource'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "traitify.js",
    library: "Traitify",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  plugins: [
    new webpack.ProvidePlugin({"React": "react"}),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(process.env.npm_package_version)
    })
  ],
  resolve: {
    extensions: [".jsx", ".js", ".json", ".scss"],
    modules: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "node_modules")
    ],
    alias: {
      style: path.resolve(__dirname, "src/style")
    }
  }
};

const ie = process.env.MODE === "ie";
const compatibility = ie || process.env.MODE === "compatibility";
const browser = compatibility || process.env.MODE === "browser";

if(browser){
  config.entry.unshift("core-js/stable");
  config.entry.unshift("regenerator-runtime/runtime");
  config.output.libraryExport = "default";
  delete config.externals;
}
if(compatibility){ config.entry[2] = "./compatibility.js"; }
if(ie){
  config.devServer.inline = false;
  delete config.devtool;
}

module.exports = config;
